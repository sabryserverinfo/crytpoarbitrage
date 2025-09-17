import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
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
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Bienvenue, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
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
