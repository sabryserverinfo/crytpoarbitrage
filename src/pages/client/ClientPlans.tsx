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
          <Card key={plan.id} className="relative overflow-hidden panel elevate-sm hover-ring transition-all duration-300">
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
