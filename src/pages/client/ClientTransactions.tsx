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
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

      <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
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
