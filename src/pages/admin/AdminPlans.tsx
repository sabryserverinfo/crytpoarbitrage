import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { planService } from '../../services/githubService';
import type { Plan } from '../../types';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';

const AdminPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    asset: 'USDT',
    yield_percent: 8,
    min_eur: 100,
    max_eur: 1000,
    duration_months: 6,
    description: ''
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const plansData = await planService.getAll();
      setPlans(plansData);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPlan: Plan = {
        id: `plan${Date.now()}`,
        ...formData
      };
      
      await planService.create(newPlan);
      await loadPlans();
      setShowAddForm(false);
      resetForm();
      alert('Plan créé avec succès !');
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Erreur lors de la création du plan');
    }
  };

  const handleEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      await planService.update(editingPlan.id, formData);
      await loadPlans();
      setEditingPlan(null);
      resetForm();
      alert('Plan modifié avec succès !');
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Erreur lors de la modification du plan');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) return;

    try {
      await planService.delete(planId);
      await loadPlans();
      alert('Plan supprimé avec succès !');
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Erreur lors de la suppression du plan');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      asset: 'USDT',
      yield_percent: 8,
      min_eur: 100,
      max_eur: 1000,
      duration_months: 6,
      description: ''
    });
  };

  const startEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      asset: plan.asset,
      yield_percent: plan.yield_percent,
      min_eur: plan.min_eur,
      max_eur: plan.max_eur,
      duration_months: plan.duration_months,
      description: plan.description
    });
  };

  const getAssetIcon = (asset: string) => {
    const icons: Record<string, string> = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'USDT': '₮',
      'USDC': '₮',
    };
    return icons[asset] || '₿';
  };

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gradient-silver tracking-tight">Gestion des Plans</h1>
          <p className="text-gray-400">Créez et gérez les plans d'investissement</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Créer un plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="panel elevate-sm hover-ring transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Plans
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {plans.length}
            </div>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Rendement Moyen
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {plans.length > 0 ? (plans.reduce((sum, p) => sum + p.yield_percent, 0) / plans.length).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Durée Moyenne
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {plans.length > 0 ? (plans.reduce((sum, p) => sum + p.duration_months, 0) / plans.length).toFixed(0) : 0} mois
            </div>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Investissement Min
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {plans.length > 0 ? Math.min(...plans.map(p => p.min_eur)) : 0}€
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="panel elevate-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher un plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="panel elevate-sm hover-ring transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                <div className="text-2xl">
                  {getAssetIcon(plan.asset)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-primary-500">
                    {plan.yield_percent}%
                  </div>
                  <div className="text-sm text-gray-400">Rendement</div>
                </div>
                <div className="text-center p-3 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    {plan.duration_months}
                  </div>
                  <div className="text-sm text-gray-400">Mois</div>
                </div>
              </div>

              {/* Asset Info */}
              <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getAssetIcon(plan.asset)}</span>
                  <span className="text-white font-medium">{plan.asset}</span>
                </div>
              </div>

              {/* Investment Range */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Montant d'investissement</span>
                </div>
                <div className="text-center p-2 bg-dark-700 rounded">
                  <span className="text-white font-medium">
                    {plan.min_eur.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })} - {plan.max_eur.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startEdit(plan)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingPlan) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md panel elevate-md">
            <CardHeader>
              <CardTitle>
                {editingPlan ? 'Modifier le plan' : 'Créer un plan'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingPlan ? handleEditPlan : handleAddPlan} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du plan</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asset">Actif crypto</Label>
                  <select
                    id="asset"
                    value={formData.asset}
                    onChange={(e) => setFormData({...formData, asset: e.target.value})}
                    className="w-full h-10 px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                    <option value="USDC">USD Coin (USDC)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yield_percent">Rendement (%)</Label>
                    <Input
                      id="yield_percent"
                      type="number"
                      value={formData.yield_percent}
                      onChange={(e) => setFormData({...formData, yield_percent: parseFloat(e.target.value)})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration_months">Durée (mois)</Label>
                    <Input
                      id="duration_months"
                      type="number"
                      value={formData.duration_months}
                      onChange={(e) => setFormData({...formData, duration_months: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_eur">Montant min (€)</Label>
                    <Input
                      id="min_eur"
                      type="number"
                      value={formData.min_eur}
                      onChange={(e) => setFormData({...formData, min_eur: parseFloat(e.target.value)})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_eur">Montant max (€)</Label>
                    <Input
                      id="max_eur"
                      type="number"
                      value={formData.max_eur}
                      onChange={(e) => setFormData({...formData, max_eur: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1">
                    {editingPlan ? 'Modifier' : 'Créer'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingPlan(null);
                      resetForm();
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;
