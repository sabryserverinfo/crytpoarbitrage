import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { userService, walletService, transactionService, planService } from '../../services/githubService';
import { coinapiService } from '../../services/coinapiService';
import type { User, Wallet, Transaction, Plan, DashboardStats } from '../../types';
import { 
  Users, 
  Wallet as WalletIcon, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBalance: 0,
    totalROI: 0,
    pendingTransactions: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger toutes les données en parallèle
      const [usersData, walletsData, transactionsData, plansData] = await Promise.all([
        userService.getAll(),
        walletService.getAll(),
        transactionService.getAll(),
        planService.getAll(),
      ]);

      setUsers(usersData);
      setWallets(walletsData);
      setTransactions(transactionsData);
      setPlans(plansData);

      // Charger les prix crypto
      const assets = [...new Set(walletsData.map(w => w.asset))];
      const prices = await coinapiService.getPrices(assets);
      setCryptoPrices(prices);

      // Calculer les statistiques
      const totalUsers = usersData.filter(u => u.role === 'user').length;
      const totalBalance = await calculateTotalBalance(walletsData, prices);
      const totalROI = calculateTotalROI(transactionsData);
      const pendingTransactions = transactionsData.filter(t => t.status === 'pending').length;

      setStats({
        totalUsers,
        totalBalance,
        totalROI,
        pendingTransactions,
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalBalance = async (wallets: Wallet[], prices: Record<string, number>): Promise<number> => {
    let total = 0;
    for (const wallet of wallets) {
      const price = prices[wallet.asset] || 0;
      total += wallet.balance * price;
    }
    return total;
  };

  const calculateTotalROI = (transactions: Transaction[]): number => {
    const investments = transactions.filter(t => t.type === 'INVEST' && t.status === 'confirmed');
    const profits = transactions.filter(t => t.type === 'PROFIT' && t.status === 'confirmed');
    
    const totalInvested = investments.reduce((sum, t) => sum + t.amount, 0);
    const totalProfits = profits.reduce((sum, t) => sum + t.amount, 0);
    
    return totalInvested > 0 ? (totalProfits / totalInvested) * 100 : 0;
  };

  const generateUserGrowthData = () => {
    // Simulation de données de croissance utilisateur
    const data = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      
      data.push({
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        users: Math.floor(Math.random() * 10) + 1,
      });
    }
    
    return data;
  };

  const generateAssetDistributionData = () => {
    const assetTotals: Record<string, number> = {};
    
    wallets.forEach(wallet => {
      const price = cryptoPrices[wallet.asset] || 0;
      const value = wallet.balance * price;
      assetTotals[wallet.asset] = (assetTotals[wallet.asset] || 0) + value;
    });

    return Object.entries(assetTotals).map(([asset, value]) => ({
      name: asset,
      value: value,
    }));
  };

  const getAssetColor = (asset: string) => {
    const colors: Record<string, string> = {
      'BTC': '#f7931a',
      'ETH': '#627eea',
      'USDT': '#26a17b',
      'USDC': '#2775ca',
    };
    return colors[asset] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const recentTransactions = transactions
    .filter(t => t.status === 'pending')
    .slice(0, 5);

  const userGrowthData = generateUserGrowthData();
  const assetDistributionData = generateAssetDistributionData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gradient-silver tracking-tight">Dashboard Administrateur</h1>
          <p className="text-gray-400">Vue d'ensemble de la plateforme</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Button size="sm" variant="outline" className="border-primary-500/40 text-primary-400 hover:bg-primary-500/10">Exporter</Button>
          <Button size="sm" className="bg-gradient-to-r from-primary-500 to-blue-600">Créer un plan</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Utilisateurs
            </CardTitle>
            <Users className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-green-400 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{users.length} total
            </p>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Solde Global
            </CardTitle>
            <WalletIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalBalance.toLocaleString('fr-FR', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </div>
            <p className="text-xs text-green-400">
              Tous portefeuilles
            </p>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              ROI Global
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              +{stats.totalROI.toFixed(2)}%
            </div>
            <p className="text-xs text-blue-400">
              Performance moyenne
            </p>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              En Attente
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.pendingTransactions}
            </div>
            <p className="text-xs text-yellow-400">
              Transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="panel elevate-sm">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Croissance des Utilisateurs</CardTitle>
            <CardDescription>
              Nouveaux utilisateurs par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="users" fill="#00A3FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="crypto-panel">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Répartition des Actifs</CardTitle>
            <CardDescription>
              Distribution par crypto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getAssetColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pending Transactions */}
      <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <span>Transactions en Attente</span>
          </CardTitle>
          <CardDescription>
            Actions requises de votre part
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowUpRight className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-gray-400">Aucune transaction en attente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const user = users.find(u => u.id === transaction.user_id);
                const date = new Date(transaction.timestamp);
                
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        {transaction.type === 'WITHDRAW' ? 
                          <ArrowUpRight className="w-5 h-5 text-yellow-500" /> :
                          <ArrowDownRight className="w-5 h-5 text-yellow-500" />
                        }
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {transaction.type === 'WITHDRAW' ? 'Demande de retrait' : 'Dépôt'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {user?.name} - {transaction.amount} {transaction.asset}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {date.toLocaleDateString('fr-FR')} à {date.toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Voir détails
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="panel elevate-sm">
          <CardHeader>
            <CardTitle className="text-lg">Plans Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-500">
              {plans.length}
            </div>
            <p className="text-sm text-gray-400">
              Plans d'investissement disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portefeuilles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {wallets.length}
            </div>
            <p className="text-sm text-gray-400">
              Portefeuilles utilisateurs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {transactions.length}
            </div>
            <p className="text-sm text-gray-400">
              Total des opérations
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

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
        <Card className="crypto-card">
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

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { settingsService } from '../../services/githubService';
import type { Settings } from '../../types';
import { 
  Save, 
  RefreshCw,
  Key,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    coingecko_api_key: '',
    cache_duration: 60,
    default_currency: 'EUR',
    app_name: 'Crypto-Arbitrage',
    version: '1.0.0',
    maintenance_mode: false,
    features: {
      arbitrage_simulation: true,
      real_time_prices: true,
      admin_panel: true,
      user_registration: false
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsData = await settingsService.get();
      setSettings(settingsData);
      setFormData({
        coingecko_api_key: settingsData.coingecko_api_key,
        cache_duration: settingsData.cache_duration,
        default_currency: settingsData.default_currency,
        app_name: settingsData.app_name,
        version: settingsData.version,
        maintenance_mode: settingsData.maintenance_mode,
        features: settingsData.features
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsService.update(formData);
      await loadSettings();
      alert('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser les paramètres ?')) return;
    loadSettings();
  };

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
          <h1 className="text-3xl font-extrabold text-gradient-silver tracking-tight">Paramètres</h1>
          <p className="text-gray-400">Configurez les paramètres globaux de l'application</p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* API Configuration */}
        <Card className="panel elevate-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              <Key className="w-5 h-5" />
              <span>Configuration API</span>
            </CardTitle>
            <CardDescription>
              Paramètres des services externes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coingecko_api_key">Clé API CoinGecko</Label>
              <Input
                id="coingecko_api_key"
                type="password"
                value={formData.coingecko_api_key}
                onChange={(e) => setFormData({...formData, coingecko_api_key: e.target.value})}
                placeholder="Votre clé API CoinGecko"
                required
              />
              <p className="text-sm text-gray-400">
                Clé API pour récupérer les prix crypto en temps réel
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cache_duration">Durée du cache (secondes)</Label>
              <Input
                id="cache_duration"
                type="number"
                value={formData.cache_duration}
                onChange={(e) => setFormData({...formData, cache_duration: parseInt(e.target.value)})}
                min="1"
                max="3600"
                required
              />
              <p className="text-sm text-gray-400">
                Durée de mise en cache des prix crypto (1-3600 secondes)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              <Globe className="w-5 h-5" />
              <span>Paramètres de l'Application</span>
            </CardTitle>
            <CardDescription>
              Configuration générale de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="app_name">Nom de l'application</Label>
                <Input
                  id="app_name"
                  value={formData.app_name}
                  onChange={(e) => setFormData({...formData, app_name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({...formData, version: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_currency">Devise par défaut</Label>
              <select
                id="default_currency"
                value={formData.default_currency}
                onChange={(e) => setFormData({...formData, default_currency: e.target.value})}
                className="w-full h-10 px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar US (USD)</option>
                <option value="GBP">Livre Sterling (GBP)</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="maintenance_mode"
                checked={formData.maintenance_mode}
                onChange={(e) => setFormData({...formData, maintenance_mode: e.target.checked})}
                className="w-4 h-4 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
              />
              <Label htmlFor="maintenance_mode">Mode maintenance</Label>
            </div>
            <p className="text-sm text-gray-400">
              Active le mode maintenance pour bloquer l'accès aux utilisateurs
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              <Zap className="w-5 h-5" />
              <span>Fonctionnalités</span>
            </CardTitle>
            <CardDescription>
              Activez ou désactivez les fonctionnalités de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="arbitrage_simulation"
                  checked={formData.features.arbitrage_simulation}
                  onChange={(e) => setFormData({
                    ...formData, 
                    features: {...formData.features, arbitrage_simulation: e.target.checked}
                  })}
                  className="w-4 h-4 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                />
                <Label htmlFor="arbitrage_simulation">Simulation d'arbitrage</Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="real_time_prices"
                  checked={formData.features.real_time_prices}
                  onChange={(e) => setFormData({
                    ...formData, 
                    features: {...formData.features, real_time_prices: e.target.checked}
                  })}
                  className="w-4 h-4 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                />
                <Label htmlFor="real_time_prices">Prix en temps réel</Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="admin_panel"
                  checked={formData.features.admin_panel}
                  onChange={(e) => setFormData({
                    ...formData, 
                    features: {...formData.features, admin_panel: e.target.checked}
                  })}
                  className="w-4 h-4 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                />
                <Label htmlFor="admin_panel">Panneau d'administration</Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="user_registration"
                  checked={formData.features.user_registration}
                  onChange={(e) => setFormData({
                    ...formData, 
                    features: {...formData.features, user_registration: e.target.checked}
                  })}
                  className="w-4 h-4 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                />
                <Label htmlFor="user_registration">Inscription utilisateur</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex space-x-3">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetSettings}
                disabled={saving}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* System Info */}
      <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            <Shield className="w-5 h-5" />
            <span>Informations Système</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Version de l'application</p>
              <p className="text-white font-medium">{settings?.version || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Dernière mise à jour</p>
              <p className="text-white font-medium">
                {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Mode maintenance</p>
              <p className={`font-medium ${settings?.maintenance_mode ? 'text-red-400' : 'text-green-400'}`}>
                {settings?.maintenance_mode ? 'Activé' : 'Désactivé'}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Cache des prix</p>
              <p className="text-white font-medium">
                {settings?.cache_duration || 60} secondes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { transactionService, userService } from '../../services/githubService';
import type { Transaction, User } from '../../types';
import { 
  History, 
  Search,
  Check,
  X,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, usersData] = await Promise.all([
        transactionService.getAll(),
        userService.getAll()
      ]);
      
      // Trier par date décroissante
      const sortedTransactions = transactionsData.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setTransactions(sortedTransactions);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTransaction = async (transactionId: string, status: 'confirmed' | 'rejected', reason?: string) => {
    try {
      await transactionService.update(transactionId, { 
        status, 
        ...(reason && { reason }) 
      });
      await loadData();
      alert(`Transaction ${status === 'confirmed' ? 'confirmée' : 'rejetée'} avec succès !`);
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Erreur lors de la mise à jour de la transaction');
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownRight className="w-5 h-5 text-green-500" />;
      case 'WITHDRAW':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'INVEST':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'PROFIT':
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'Dépôt';
      case 'WITHDRAW':
        return 'Retrait';
      case 'INVEST':
        return 'Investissement';
      case 'PROFIT':
        return 'Profit';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge badge--success';
      case 'pending':
        return 'badge badge--warning';
      case 'rejected':
        return 'badge badge--danger';
      default:
        return 'badge badge--info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Utilisateur inconnu';
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredTransactions = transactions.filter(transaction => {
    const userName = getUserName(transaction.user_id);
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.asset.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesUser = userFilter === 'all' || transaction.user_id === userFilter;

    return matchesSearch && matchesStatus && matchesType && matchesUser;
  });

  const getTransactionStats = () => {
    const totalTransactions = transactions.length;
    const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
    const confirmedTransactions = transactions.filter(t => t.status === 'confirmed').length;
    const rejectedTransactions = transactions.filter(t => t.status === 'rejected').length;

    return { totalTransactions, pendingTransactions, confirmedTransactions, rejectedTransactions };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const stats = getTransactionStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gradient-silver tracking-tight">Gestion des Transactions</h1>
          <p className="text-gray-400">Gérez toutes les transactions de la plateforme</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Transactions
            </CardTitle>
            <History className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalTransactions}
            </div>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              En Attente
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.pendingTransactions}
            </div>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Confirmées
            </CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.confirmedTransactions}
            </div>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Rejetées
            </CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.rejectedTransactions}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="panel elevate-sm">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une transaction..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Statut</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="confirmed">Confirmé</option>
                <option value="pending">En attente</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous les types</option>
                <option value="DEPOSIT">Dépôt</option>
                <option value="WITHDRAW">Retrait</option>
                <option value="INVEST">Investissement</option>
                <option value="PROFIT">Profit</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Utilisateur</label>
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous les utilisateurs</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Liste des Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table">
            <div className="table-header" style={{gridTemplateColumns: '1.2fr 0.6fr 0.5fr 0.5fr'}}>
              <div>Détails</div>
              <div>Montant</div>
              <div>Statut</div>
              <div>Actions</div>
            </div>
            {filteredTransactions.map((transaction) => {
              const { date, time } = formatDate(transaction.timestamp);
              const userName = getUserName(transaction.user_id);
              return (
                <div key={transaction.id} className="table-row" style={{gridTemplateColumns: '1.2fr 0.6fr 0.5fr 0.5fr'}}>
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 bg-dark-600 rounded-full flex items-center justify-center flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">
                        {getTransactionTypeLabel(transaction.type)}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {userName} • {transaction.asset}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {date} à {time}
                      </p>
                    </div>
                  </div>
                  <div className="text-white font-medium">
                    {transaction.amount.toFixed(6)} {transaction.asset}
                  </div>
                  <div>
                    <span className={getStatusBadge(transaction.status)}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {transaction.status === 'pending' ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTransaction(transaction.id, 'confirmed')}
                          className="bg-green-500 hover:bg-green-600"
                          aria-label="Confirmer"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            const reason = prompt('Raison du rejet (optionnel):');
                            handleUpdateTransaction(transaction.id, 'rejected', reason || undefined);
                          }}
                          className="bg-red-500 hover:bg-red-600"
                          aria-label="Rejeter"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <span className="text-gray-500 text-xs">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactions;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { userService } from '../../services/githubService';
import type { User } from '../../types';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Shield,
  User as UserIcon
} from 'lucide-react';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAll();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser: User = {
        id: `u${Date.now()}`,
        ...formData
      };
      
      await userService.create(newUser);
      await loadUsers();
      setShowAddForm(false);
      resetForm();
      alert('Utilisateur créé avec succès !');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Erreur lors de la création de l\'utilisateur');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await userService.update(editingUser.id, formData);
      await loadUsers();
      setEditingUser(null);
      resetForm();
      alert('Utilisateur modifié avec succès !');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Erreur lors de la modification de l\'utilisateur');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      await userService.delete(userId);
      await loadUsers();
      alert('Utilisateur supprimé avec succès !');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-extrabold text-gradient-silver tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-gray-400">Gérez les comptes utilisateurs et administrateurs</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Utilisateurs
            </CardTitle>
            <Users className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {users.filter(u => u.role === 'user').length}
            </div>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Administrateurs
            </CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Comptes
            </CardTitle>
            <UserIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {users.length}
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
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Liste des Utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table">
            <div className="table-header" style={{gridTemplateColumns: '1.2fr 1fr 0.6fr 0.5fr'}}>
              <div>Utilisateur</div>
              <div>Email</div>
              <div>Rôle</div>
              <div>Actions</div>
            </div>
            {filteredUsers.map((user) => (
              <div key={user.id} className="table-row" style={{gridTemplateColumns: '1.2fr 1fr 0.6fr 0.5fr'}}>
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${user.role === 'admin' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}> 
                    {user.role === 'admin' ? <Shield className="w-4 h-4 text-red-500" /> : <UserIcon className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-white font-medium truncate">{user.name}</p>
                </div>
                <div className="text-gray-300 truncate">{user.email}</div>
                <div>
                  <span className={user.role === 'admin' ? 'badge badge--danger' : 'badge badge--info'}>
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(user)}
                    aria-label="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-400 hover:text-red-300"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingUser) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md panel elevate-md">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingUser ? handleEditUser : handleAddUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'user' | 'admin'})}
                    className="w-full h-10 px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1">
                    {editingUser ? 'Modifier' : 'Créer'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingUser(null);
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

export default AdminUsers;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { walletService, userService } from '../../services/githubService';
import { coinapiService } from '../../services/coinapiService';
import type { Wallet, User } from '../../types';
import { 
  Wallet as WalletIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  DollarSign,
  User as UserIcon
} from 'lucide-react';

const AdminWallets: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({
    user_id: '',
    asset: 'USDT',
    balance: 0,
    deposit_address: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [walletsData, usersData] = await Promise.all([
        walletService.getAll(),
        userService.getAll()
      ]);
      
      setWallets(walletsData);
      setUsers(usersData);

      // Charger les prix crypto
      const assets = [...new Set(walletsData.map(w => w.asset))];
      const prices = await coinapiService.getPrices(assets);
      setCryptoPrices(prices);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newWallet: Wallet = {
        ...formData
      };
      
      await walletService.create(newWallet);
      await loadData();
      setShowAddForm(false);
      resetForm();
      alert('Portefeuille créé avec succès !');
    } catch (error) {
      console.error('Error creating wallet:', error);
      alert('Erreur lors de la création du portefeuille');
    }
  };

  const handleEditWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWallet) return;

    try {
      await walletService.update(editingWallet.user_id, editingWallet.asset, formData);
      await loadData();
      setEditingWallet(null);
      resetForm();
      alert('Portefeuille modifié avec succès !');
    } catch (error) {
      console.error('Error updating wallet:', error);
      alert('Erreur lors de la modification du portefeuille');
    }
  };

  const handleDeleteWallet = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce portefeuille ?')) return;

    try {
      // Note: Il faudrait ajouter une méthode delete dans walletService
      alert('Fonctionnalité de suppression à implémenter');
    } catch (error) {
      console.error('Error deleting wallet:', error);
      alert('Erreur lors de la suppression du portefeuille');
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      asset: 'USDT',
      balance: 0,
      deposit_address: ''
    });
  };

  const startEdit = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setFormData({
      user_id: wallet.user_id,
      asset: wallet.asset,
      balance: wallet.balance,
      deposit_address: wallet.deposit_address
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

  const getAssetColor = (asset: string) => {
    const colors: Record<string, string> = {
      'BTC': 'bg-orange-500',
      'ETH': 'bg-blue-500',
      'USDT': 'bg-green-500',
      'USDC': 'bg-blue-600',
    };
    return colors[asset] || 'bg-gray-500';
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Utilisateur inconnu';
  };

  const filteredWallets = wallets.filter(wallet => {
    const userName = getUserName(wallet.user_id);
    return userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           wallet.asset.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalValue = wallets.reduce((sum, wallet) => {
    const price = cryptoPrices[wallet.asset] || 0;
    return sum + (wallet.balance * price);
  }, 0);

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
          <h1 className="text-3xl font-extrabold text-gradient-silver tracking-tight">Gestion des Portefeuilles</h1>
          <p className="text-gray-400">Gérez les portefeuilles crypto des utilisateurs</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un portefeuille
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Portefeuilles
            </CardTitle>
            <WalletIcon className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {wallets.length}
            </div>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Valeur Totale
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalValue.toLocaleString('fr-FR', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Utilisateurs Actifs
            </CardTitle>
            <UserIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {new Set(wallets.map(w => w.user_id)).size}
            </div>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Actifs Supportés
            </CardTitle>
            <WalletIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {new Set(wallets.map(w => w.asset)).size}
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
              placeholder="Rechercher un portefeuille..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Wallets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWallets.map((wallet) => {
          return (
            <Card key={`${wallet.user_id}-${wallet.asset}`} className="panel elevate-sm hover-ring transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${getAssetColor(wallet.asset)} rounded-lg flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {getAssetIcon(wallet.asset)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{wallet.asset}</CardTitle>
                      <CardDescription>{getUserName(wallet.user_id)}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Balance */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Solde</span>
                    <span className="text-white font-medium">
                      {wallet.balance.toFixed(6)} {wallet.asset}
                    </span>
                  </div>
                </div>

                {/* Deposit Address */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Adresse de dépôt</span>
                  </div>
                  <div className="p-3 bg-dark-700 rounded-lg">
                    <p className="text-xs text-gray-400 break-all">
                      {wallet.deposit_address}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEdit(wallet)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDeleteWallet}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Wallets List */}
      <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Liste des Portefeuilles</CardTitle>
          <CardDescription>
            {filteredWallets.length} portefeuille(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table">
            <div className="table-header" style={{gridTemplateColumns: '1fr 0.6fr 0.8fr 1fr 0.5fr'}}>
              <div>Utilisateur</div>
              <div>Asset</div>
              <div>Balance</div>
              <div>Adresse</div>
              <div>Actions</div>
            </div>
            {filteredWallets.map((wallet) => {
              const user = users.find(u => u.id === wallet.user_id);
              const price = cryptoPrices[wallet.asset] || 0;
              const value = wallet.balance * price;
              
              return (
                <div key={`${wallet.user_id}-${wallet.asset}`} className="table-row" style={{gridTemplateColumns: '1fr 0.6fr 0.8fr 1fr 0.5fr'}}>
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 bg-dark-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <WalletIcon className="w-4 h-4 text-primary-500" />
                    </div>
                    <p className="text-white font-medium truncate">{user?.name || 'Utilisateur inconnu'}</p>
                  </div>
                  <div className="text-white font-medium">{wallet.asset}</div>
                  <div>
                    <p className="text-white font-medium">
                      {wallet.balance.toFixed(6)} {wallet.asset}
                    </p>
                    <p className="text-gray-400 text-xs">
                      ≈ ${value.toFixed(2)}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-300 text-sm font-mono truncate" title={wallet.deposit_address}>
                      {wallet.deposit_address.slice(0, 8)}...{wallet.deposit_address.slice(-6)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(wallet)}
                      aria-label="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteWallet()}
                      className="text-red-400 hover:text-red-300"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingWallet) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingWallet ? 'Modifier le portefeuille' : 'Ajouter un portefeuille'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingWallet ? handleEditWallet : handleAddWallet} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user_id">Utilisateur</Label>
                  <select
                    id="user_id"
                    value={formData.user_id}
                    onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                    className="w-full h-10 px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Sélectionner un utilisateur</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asset">Actif crypto</Label>
                  <select
                    id="asset"
                    value={formData.asset}
                    onChange={(e) => setFormData({...formData, asset: e.target.value})}
                    className="w-full h-10 px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                    <option value="USDC">USD Coin (USDC)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balance">Solde</Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.000001"
                    value={formData.balance}
                    onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value)})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit_address">Adresse de dépôt</Label>
                  <Input
                    id="deposit_address"
                    value={formData.deposit_address}
                    onChange={(e) => setFormData({...formData, deposit_address: e.target.value})}
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1">
                    {editingWallet ? 'Modifier' : 'Créer'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingWallet(null);
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

export default AdminWallets;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { walletService, transactionService } from '../../services/githubService';
import { coinapiService } from '../../services/coinapiService';
import type { Wallet, Transaction, UserStats } from '../../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet as WalletIcon, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalBalance: 0,
    totalROI: 0,
    activeInvestments: 0,
    pendingTransactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Charger les portefeuilles et transactions
      const [userWallets, userTransactions] = await Promise.all([
        walletService.getByUserId(user.id),
        transactionService.getByUserId(user.id),
      ]);

      setWallets(userWallets);
      setTransactions(userTransactions);

      // Charger les prix crypto
      const assets = [...new Set(userWallets.map(w => w.asset))];
      const prices = await coinapiService.getPrices(assets);
      setCryptoPrices(prices);

      // Calculer les statistiques
      const totalBalance = await calculateTotalBalance(userWallets, prices);
      const totalROI = calculateROI(userTransactions);
      const activeInvestments = userTransactions.filter(t => 
        t.type === 'INVEST' && t.status === 'confirmed'
      ).length;
      const pendingTransactions = userTransactions.filter(t => 
        t.status === 'pending'
      ).length;

      setStats({
        totalBalance,
        totalROI,
        activeInvestments,
        pendingTransactions,
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalBalance = async (wallets: Wallet[], prices: Record<string, number>): Promise<number> => {
    let total = 0;
    for (const wallet of wallets) {
      const price = prices[wallet.asset] || 0;
      total += wallet.balance * price;
    }
    return total;
  };

  const calculateROI = (transactions: Transaction[]): number => {
    const investments = transactions.filter(t => t.type === 'INVEST' && t.status === 'confirmed');
    const profits = transactions.filter(t => t.type === 'PROFIT' && t.status === 'confirmed');
    
    const totalInvested = investments.reduce((sum, t) => sum + t.amount, 0);
    const totalProfits = profits.reduce((sum, t) => sum + t.amount, 0);
    
    return totalInvested > 0 ? (totalProfits / totalInvested) * 100 : 0;
  };

  const generateChartData = () => {
    // Simulation de données pour le graphique
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        value: stats.totalBalance * (0.8 + Math.random() * 0.4), // Simulation de variation
      });
    }
    
    return data;
  };

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
          <h1 className="text-3xl font-extrabold text-gradient-silver tracking-tight">Tableau de bord</h1>
          <p className="text-gray-400">Bienvenue, {user?.name}</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Button size="sm" variant="outline" className="border-primary-500/40 text-primary-400 hover:bg-primary-500/10">Déposer</Button>
          <Button size="sm" className="bg-gradient-to-r from-primary-500 to-blue-600">Nouveau plan</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Solde Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalBalance.toLocaleString('fr-FR', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </div>
            <p className="text-xs text-green-400 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5% ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              ROI Total
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              +{stats.totalROI.toFixed(2)}%
            </div>
            <p className="text-xs text-green-400 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Performance positive
            </p>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Investissements Actifs
            </CardTitle>
            <WalletIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.activeInvestments}
            </div>
            <p className="text-xs text-blue-400">
              Plans en cours
            </p>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              En Attente
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.pendingTransactions}
            </div>
            <p className="text-xs text-yellow-400">
              Transactions en cours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="crypto-panel">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Évolution du Portefeuille</CardTitle>
            <CardDescription>
              Performance sur les 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00A3FF" 
                    strokeWidth={2}
                    dot={{ fill: '#00A3FF', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Wallets Summary */}
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Portefeuilles</CardTitle>
            <CardDescription>
              Répartition de vos actifs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wallets.map((wallet) => {
                const price = cryptoPrices[wallet.asset] || 0;
                const valueEUR = wallet.balance * price;
                
                return (
                  <div key={`${wallet.user_id}-${wallet.asset}`} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-500">
                          {wallet.asset}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{wallet.asset}</p>
                        <p className="text-gray-400 text-sm">
                          {wallet.balance.toFixed(6)} {wallet.asset}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        {valueEUR.toLocaleString('fr-FR', { 
                          style: 'currency', 
                          currency: 'EUR' 
                        })}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {price.toLocaleString('fr-FR', { 
                          style: 'currency', 
                          currency: 'EUR' 
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Dernières Transactions</CardTitle>
          <CardDescription>
            Historique de vos opérations récentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'DEPOSIT' ? 'bg-green-500/20' :
                    transaction.type === 'WITHDRAW' ? 'bg-red-500/20' :
                    transaction.type === 'INVEST' ? 'bg-blue-500/20' :
                    'bg-yellow-500/20'
                  }`}>
                    {transaction.type === 'DEPOSIT' ? <ArrowDownRight className="w-4 h-4 text-green-500" /> :
                     transaction.type === 'WITHDRAW' ? <ArrowUpRight className="w-4 h-4 text-red-500" /> :
                     transaction.type === 'INVEST' ? <TrendingUp className="w-4 h-4 text-blue-500" /> :
                     <DollarSign className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {transaction.type === 'DEPOSIT' ? 'Dépôt' :
                       transaction.type === 'WITHDRAW' ? 'Retrait' :
                       transaction.type === 'INVEST' ? 'Investissement' :
                       'Profit'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(transaction.timestamp).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">
                    {transaction.amount} {transaction.asset}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    transaction.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                    transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {transaction.status === 'confirmed' ? 'Confirmé' :
                     transaction.status === 'pending' ? 'En attente' :
                     'Rejeté'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../hooks/useAuth';
import { planService, transactionService } from '../../services/githubService';
import { coinapiService } from '../../services/coinapiService';
import type { Plan, Transaction } from '../../types';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Calculator,
  ArrowRight,
  Star
} from 'lucide-react';

const ClientPlans: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const plansData = await planService.getAll();
      setPlans(plansData);

      // Charger les prix crypto
      const assets = [...new Set(plansData.map(p => p.asset))];
      const prices = await coinapiService.getPrices(assets);
      setCryptoPrices(prices);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async (plan: Plan) => {
    if (!user || !investmentAmount) return;

    const amount = parseFloat(investmentAmount);
    if (amount < plan.min_eur || amount > plan.max_eur) {
      alert(`Le montant doit être entre ${plan.min_eur}€ et ${plan.max_eur}€`);
      return;
    }

    try {
      const transaction: Transaction = {
        id: `tx_${Date.now()}`,
        user_id: user.id,
        type: 'INVEST',
        asset: plan.asset,
        amount: amount,
        status: 'pending',
        timestamp: new Date().toISOString(),
        plan_id: plan.id,
        description: `Investissement plan ${plan.name}`,
      };

      await transactionService.create(transaction);
      alert('Demande d\'investissement envoyée avec succès !');
      setInvestmentAmount('');
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error creating investment:', error);
      alert('Erreur lors de la création de l\'investissement');
    }
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
          <h1 className="text-3xl font-extrabold text-gradient-silver tracking-tight">Plans d'Investissement</h1>
          <p className="text-gray-400">Choisissez le plan qui correspond à vos objectifs</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-primary-500/40 text-primary-400 hover:bg-primary-500/10" onClick={() => setShowCalculator(true)}>
            Ouvrir le simulateur
          </Button>
        </div>
      </div>

      {/* Calculator */}
      {showCalculator && selectedPlan && (
        <Card className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 border-primary-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              <Calculator className="w-5 h-5" />
              <span>Simulateur de Rendement</span>
            </CardTitle>
            <CardDescription>
              Calculez vos gains potentiels avec le plan {selectedPlan.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Montant d'investissement (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  min={selectedPlan.min_eur}
                  max={selectedPlan.max_eur}
                />
                <p className="text-sm text-gray-400 mt-1">
                  Min: {selectedPlan.min_eur}€ - Max: {selectedPlan.max_eur}€
                </p>
              </div>
              <div>
                <Label>Rendement estimé</Label>
                <div className="h-10 px-3 py-2 bg-dark-700 rounded-md flex items-center">
                  <span className="text-green-400 font-medium">
                    {investmentAmount ? 
                      `+${(parseFloat(investmentAmount) * selectedPlan.yield_percent / 100).toFixed(2)}€` : 
                      '0€'
                    }
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Sur {selectedPlan.duration_months} mois
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => handleInvest(selectedPlan)}
                disabled={!investmentAmount}
                className="flex-1"
              >
                Investir maintenant
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCalculator(false)}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative overflow-hidden crypto-card">
            {plan.name === 'VIP' && (
              <div className="absolute top-4 right-4">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
            )}
            
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
                <div className="text-center p-3 bg-dark-700/70 hover:bg-dark-700/90 rounded-lg transition-colors">
                  <div className="text-2xl font-bold text-primary-500">
                    {plan.yield_percent}%
                  </div>
                  <div className="text-sm text-gray-400">Rendement</div>
                </div>
                <div className="text-center p-3 bg-dark-700/70 hover:bg-dark-700/90 rounded-lg transition-colors">
                  <div className="text-2xl font-bold text-green-500">
                    {plan.duration_months}
                  </div>
                  <div className="text-sm text-gray-400">Mois</div>
                </div>
              </div>

              {/* Asset Info */}
              <div className="flex items-center justify-between p-3 bg-dark-700/70 hover:bg-dark-700/90 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getAssetIcon(plan.asset)}</span>
                  <span className="text-white font-medium">{plan.asset}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Prix actuel</div>
                  <div className="text-white font-medium">
                    {cryptoPrices[plan.asset]?.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    }) || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Investment Range */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Montant d'investissement</span>
                </div>
                <div className="text-center p-2 bg-dark-700/70 rounded transition-colors">
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

              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-300">Rendement garanti</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-300">Durée fixe</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-300">Paiement mensuel</span>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full" 
                onClick={() => {
                  setSelectedPlan(plan);
                  setShowCalculator(true);
                }}
              >
                <span>Choisir ce plan</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Comment ça marche ?
            </h3>
            <p className="text-gray-300 mb-4">
              Nos robots d'arbitrage analysent en permanence les différences de prix entre les exchanges 
              pour générer des profits automatiquement.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">1</span>
                </div>
                <p className="text-gray-300">Choisissez votre plan</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">2</span>
                </div>
                <p className="text-gray-300">Investissez votre capital</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">3</span>
                </div>
                <p className="text-gray-300">Recevez vos profits</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPlans;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../hooks/useAuth';
import { transactionService } from '../../services/githubService';
import type { Transaction } from '../../types';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  DollarSign,
  Search,
  Filter,
  Calendar,
  Clock
} from 'lucide-react';

const ClientTransactions: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, statusFilter, typeFilter]);

  const loadTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userTransactions = await transactionService.getByUserId(user.id);
      const sortedTransactions = userTransactions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    setFilteredTransactions(filtered);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownRight className="w-5 h-5 text-green-500" />;
      case 'WITHDRAW':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'INVEST':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'PROFIT':
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'Dépôt';
      case 'WITHDRAW':
        return 'Retrait';
      case 'INVEST':
        return 'Investissement';
      case 'PROFIT':
        return 'Profit';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge badge--success';
      case 'pending':
        return 'badge badge--warning';
      case 'rejected':
        return 'badge badge--danger';
      default:
        return 'badge badge--info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTransactionStats = () => {
    const totalDeposits = transactions
      .filter(t => t.type === 'DEPOSIT' && t.status === 'confirmed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawals = transactions
      .filter(t => t.type === 'WITHDRAW' && t.status === 'confirmed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalInvestments = transactions
      .filter(t => t.type === 'INVEST' && t.status === 'confirmed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalProfits = transactions
      .filter(t => t.type === 'PROFIT' && t.status === 'confirmed')
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalDeposits, totalWithdrawals, totalInvestments, totalProfits };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const stats = getTransactionStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gradient-silver tracking-tight">Mes Transactions</h1>
          <p className="text-gray-400">Historique complet de vos opérations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Dépôts
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalDeposits.toFixed(2)}
            </div>
            <p className="text-xs text-green-400">
              Fonds déposés
            </p>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Retraits
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalWithdrawals.toFixed(2)}
            </div>
            <p className="text-xs text-red-400">
              Fonds retirés
            </p>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Investissements
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalInvestments.toFixed(2)}
            </div>
            <p className="text-xs text-blue-400">
              Capital investi
            </p>
          </CardContent>
        </Card>

        <Card className="crypto-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Profits
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalProfits.toFixed(2)}
            </div>
            <p className="text-xs text-yellow-400">
              Gains générés
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="panel elevate-sm">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Rechercher une transaction..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Statut</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="confirmed">Confirmé</option>
                <option value="pending">En attente</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous les types</option>
                <option value="DEPOSIT">Dépôt</option>
                <option value="WITHDRAW">Retrait</option>
                <option value="INVEST">Investissement</option>
                <option value="PROFIT">Profit</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Historique des Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">Aucune transaction trouvée</p>
            </div>
          ) : (
            <div className="table">
              <div className="table-header">
                <div>Détails</div>
                <div>Montant</div>
                <div>Statut</div>
              </div>
              {filteredTransactions.map((transaction) => {
                const { date, time } = formatDate(transaction.timestamp);
                return (
                  <div key={transaction.id} className="table-row">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 bg-dark-600 rounded-full flex items-center justify-center flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">
                          {getTransactionTypeLabel(transaction.type)}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {transaction.description || `Transaction ${transaction.id}`}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {date}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-white font-medium">
                      {transaction.amount.toFixed(6)} {transaction.asset}
                    </div>
                    <div>
                      <span className={getStatusBadge(transaction.status)}>
                        {getStatusLabel(transaction.status)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientTransactions;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../hooks/useAuth';
import { walletService, transactionService } from '../../services/githubService';
import { coinapiService } from '../../services/coinapiService';
import type { Wallet, Transaction } from '../../types';
import { 
  Wallet as WalletIcon, 
  Copy, 
  ExternalLink, 
  ArrowUpRight,
  QrCode,
  Eye,
  EyeOff
} from 'lucide-react';

const ClientWallets: React.FC = () => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);

  useEffect(() => {
    if (user) {
      loadWallets();
    }
  }, [user]);

  const loadWallets = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userWallets = await walletService.getByUserId(user.id);
      setWallets(userWallets);

      // Charger les prix crypto
      const assets = [...new Set(userWallets.map(w => w.asset))];
      const prices = await coinapiService.getPrices(assets);
      setCryptoPrices(prices);
    } catch (error) {
      console.error('Error loading wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user || !withdrawAmount || !selectedAsset) return;

    const amount = parseFloat(withdrawAmount);
    const wallet = wallets.find(w => w.asset === selectedAsset);
    
    if (!wallet) return;

    if (amount <= 0 || amount > wallet.balance) {
      alert('Montant invalide ou insuffisant');
      return;
    }

    try {
      const transaction: Transaction = {
        id: `tx_${Date.now()}`,
        user_id: user.id,
        type: 'WITHDRAW',
        asset: selectedAsset,
        amount: amount,
        status: 'pending',
        timestamp: new Date().toISOString(),
        description: `Demande de retrait ${selectedAsset}`,
      };

      await transactionService.create(transaction);
      alert('Demande de retrait envoyée avec succès !');
      setWithdrawAmount('');
      setSelectedAsset('');
      setShowWithdrawForm(false);
      loadWallets(); // Recharger les données
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      alert('Erreur lors de la création de la demande de retrait');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Adresse copiée dans le presse-papiers !');
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

  const getAssetColor = (asset: string) => {
    const colors: Record<string, string> = {
      'BTC': 'bg-orange-500',
      'ETH': 'bg-blue-500',
      'USDT': 'bg-green-500',
      'USDC': 'bg-blue-600',
    };
    return colors[asset] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const totalValue = wallets.reduce((sum, wallet) => {
    const price = cryptoPrices[wallet.asset] || 0;
    return sum + (wallet.balance * price);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gradient-silver tracking-tight">Mes Portefeuilles</h1>
          <p className="text-gray-400">Gérez vos actifs crypto</p>
        </div>
      </div>

      {/* Total Value */}
      <Card className="panel elevate-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-400">Valeur totale</h3>
              <p className="text-3xl font-bold text-white">
                {totalValue.toLocaleString('fr-FR', { 
                  style: 'currency', 
                  currency: 'EUR' 
                })}
              </p>
            </div>
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center">
              <WalletIcon className="w-8 h-8 text-primary-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => {
          const price = cryptoPrices[wallet.asset] || 0;
          const valueEUR = wallet.balance * price;
          
          return (
            <Card key={`${wallet.user_id}-${wallet.asset}`} className="crypto-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${getAssetColor(wallet.asset)} rounded-lg flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {getAssetIcon(wallet.asset)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{wallet.asset}</CardTitle>
                      <CardDescription>Portefeuille {wallet.asset}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Balance */}
                <div className="space-y-2 p-3 bg-dark-700/50 rounded-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Solde</span>
                    <span className="text-white font-medium">
                      {wallet.balance.toFixed(6)} {wallet.asset}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Valeur EUR</span>
                    <span className="text-white font-bold">
                      {valueEUR.toLocaleString('fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Prix unitaire</span>
                    <span className="text-gray-300">
                      {price.toLocaleString('fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Deposit Address */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Adresse de dépôt</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddresses(!showAddresses)}
                    >
                      {showAddresses ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="p-3 bg-dark-700/70 hover:bg-dark-700/90 rounded-lg transition-colors">
                    {showAddresses ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center py-2">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(wallet.deposit_address)}&size=160x160&margin=2`}
                            alt={`QR ${wallet.asset}`}
                            className="rounded-md border border-dark-600"
                            width={160}
                            height={160}
                            loading="lazy"
                          />
                        </div>
                        <p className="text-xs text-gray-400 break-all">
                          {wallet.deposit_address}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(wallet.deposit_address)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://blockchain.info/address/${wallet.deposit_address}`, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-8">
                        <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                          <QrCode className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      setSelectedAsset(wallet.asset);
                      setShowWithdrawForm(true);
                    }}
                    disabled={wallet.balance <= 0}
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Retirer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Withdraw Form Modal */}
      {showWithdrawForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md panel elevate-md">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Demande de Retrait</CardTitle>
              <CardDescription>
                Retirer des fonds de votre portefeuille {selectedAsset}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant à retirer</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  step="0.000001"
                />
                <p className="text-sm text-gray-400">
                  Solde disponible: {wallets.find(w => w.asset === selectedAsset)?.balance.toFixed(6)} {selectedAsset}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount}
                  className="flex-1"
                >
                  Confirmer
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowWithdrawForm(false);
                    setWithdrawAmount('');
                    setSelectedAsset('');
                  }}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info Section */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Comment déposer des fonds ?
            </h3>
            <p className="text-gray-300 mb-4">
              Utilisez les adresses de dépôt ci-dessus pour envoyer vos cryptomonnaies. 
              Les fonds apparaîtront dans votre portefeuille après confirmation sur la blockchain.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">1</span>
                </div>
                <p className="text-gray-300">Copiez l'adresse de dépôt</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">2</span>
                </div>
                <p className="text-gray-300">Envoyez depuis votre wallet</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">3</span>
                </div>
                <p className="text-gray-300">Attendez la confirmation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientWallets;

