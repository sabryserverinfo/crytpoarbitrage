import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

const ClientWallets: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gradient-silver tracking-tight mb-1">Portefeuilles</h1>
          <p className="text-gray-400">Vos soldes et actifs</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="btn-primary glow-primary"><RefreshCw className="w-4 h-4 mr-2"/>Actualiser</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">BTC</CardTitle>
            <Wallet className="w-4 h-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0.1524 BTC</div>
            <div className="text-xs text-gray-400 mt-1">€9 840.21</div>
          </CardContent>
        </Card>
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">ETH</CardTitle>
            <Wallet className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1.734 ETH</div>
            <div className="text-xs text-gray-400 mt-1">€3 112.04</div>
          </CardContent>
        </Card>
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">USDT</CardTitle>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">€540.00</div>
            <div className="text-xs text-gray-400 mt-1">Solde stable</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced panel */}
      <Card className="enhanced-card hover-ring">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-silver">Mouvements récents</CardTitle>
          <CardDescription>Exemple d'éléments (placeholder)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1,2,3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3">
                  {i % 2 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  )}
                  <div>
                    <div className="text-white text-sm">{i % 2 ? 'Dépôt' : 'Retrait'} #{i}</div>
                    <div className="text-gray-400 text-xs">USDT • €{i % 2 ? '250,00' : '120,00'}</div>
                  </div>
                </div>
                <span className="text-gray-400 text-xs">Il y a {i} j</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientWallets;
