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
    
    wallets.forEach((wallet: Wallet) => {
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
          <Button size="sm" className="btn-primary glow-primary">Créer un plan</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card hover-ring">
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

        <Card className="stat-card hover-ring">
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

        <Card className="stat-card hover-ring">
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

        <Card className="stat-card hover-ring">
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
        <Card className="enhanced-card hover-ring">
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

        <Card className="enhanced-card hover-ring">
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
      <Card className="enhanced-card hover-ring">
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
              {recentTransactions.map((transaction: Transaction) => {
                const user = users.find((u: User) => u.id === transaction.user_id);
                const date = new Date(transaction.timestamp || Date.now());
                
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-4 enhanced-card hover-ring">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'WITHDRAW' ? 'bg-red-500/20' : 'bg-green-500/20'
                      }`}>
                        {transaction.type === 'WITHDRAW' ? 
                          <ArrowDownRight className="w-5 h-5 text-red-400" /> : 
                          <ArrowUpRight className="w-5 h-5 text-green-400" />
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
        <Card className="stat-card hover-ring">
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

        <Card className="stat-card hover-ring">
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

        <Card className="stat-card hover-ring">
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
