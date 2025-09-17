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
          <h1 className="text-3xl font-bold text-white">Gestion des Portefeuilles</h1>
          <p className="text-gray-400">Gérez les portefeuilles crypto des utilisateurs</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un portefeuille
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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

        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-all duration-300">
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
      <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
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
          const price = cryptoPrices[wallet.asset] || 0;
          const valueEUR = wallet.balance * price;
          
          return (
            <Card key={`${wallet.user_id}-${wallet.asset}`} className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm hover:bg-dark-800/80 transition-colors">
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
