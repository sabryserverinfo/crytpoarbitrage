import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

const AdminWallets: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gradient-silver tracking-tight mb-1">Portefeuilles</h1>
          <p className="text-gray-400">Gestion des portefeuilles utilisateurs</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="btn-primary glow-primary"><RefreshCw className="w-4 h-4 mr-2"/>Actualiser</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">Soldes totaux</CardTitle>
            <Wallet className="w-4 h-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">€182 450,12</div>
            <div className="text-xs text-gray-400 mt-1">Tous utilisateurs</div>
          </CardContent>
        </Card>
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">Dépôts 7j</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">€24 300</div>
            <div className="text-xs text-green-400 mt-1">Entrants</div>
          </CardContent>
        </Card>
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">Retraits 7j</CardTitle>
            <ArrowDownRight className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">€11 950</div>
            <div className="text-xs text-red-400 mt-1">Sortants</div>
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
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3">
                  {i % 2 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  )}
                  <div>
                    <div className="text-white text-sm">{i % 2 ? 'Dépôt' : 'Retrait'} • Utilisateur #{i}</div>
                    <div className="text-gray-400 text-xs">USDT • €{i % 2 ? '1 250,00' : '620,00'}</div>
                  </div>
                </div>
                <span className="text-gray-400 text-xs">Il y a {i} h</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWallets;
