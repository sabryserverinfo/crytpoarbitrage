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
    const baseClasses = "inline-block px-2 py-1 text-xs rounded-full font-medium";
    
    switch (status) {
      case 'confirmed':
        return `${baseClasses} bg-green-500/20 text-green-400`;
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      case 'rejected':
        return `${baseClasses} bg-red-500/20 text-red-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
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
      <div>
        <h1 className="text-3xl font-bold text-white">Gestion des Transactions</h1>
        <p className="text-gray-400">Gérez toutes les transactions de la plateforme</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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
      <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
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
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const { date, time } = formatDate(transaction.timestamp);
              const userName = getUserName(transaction.user_id);
              
              return (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-dark-700/80 border border-dark-600/60 rounded-lg hover:bg-dark-700 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-dark-600 rounded-full flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {getTransactionTypeLabel(transaction.type)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {userName} - {transaction.amount} {transaction.asset}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {date} à {time}
                      </p>
                      {transaction.description && (
                        <p className="text-gray-500 text-xs">
                          {transaction.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-white font-medium">
                        {transaction.amount.toFixed(6)} {transaction.asset}
                      </p>
                      <span className={getStatusBadge(transaction.status)}>
                        {getStatusLabel(transaction.status)}
                      </span>
                    </div>
                    
                    {transaction.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTransaction(transaction.id, 'confirmed')}
                          className="bg-green-500 hover:bg-green-600"
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
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
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
