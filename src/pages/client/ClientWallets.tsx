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
      <div>
        <h1 className="text-3xl font-bold text-white">Mes Portefeuilles</h1>
        <p className="text-gray-400">Gérez vos actifs crypto</p>
      </div>

      {/* Total Value */}
      <Card className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 border-primary-500/20 backdrop-blur-sm">
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
                      <CardDescription>Portefeuille {wallet.asset}</CardDescription>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddresses(!showAddresses)}
                    >
                      {showAddresses ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="p-3 bg-dark-700 rounded-lg">
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
          <Card className="w-full max-w-md bg-dark-800/90 border-dark-700/60 backdrop-blur-md">
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
