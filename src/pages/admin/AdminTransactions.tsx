import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { History, CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

const AdminTransactions: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gradient-silver tracking-tight mb-1">Transactions</h1>
          <p className="text-gray-400">Suivi des opérations et états</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="btn-primary glow-primary"><RefreshCw className="w-4 h-4 mr-2"/>Actualiser</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">Confirmées</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">254</div>
            <div className="text-xs text-green-400 mt-1">30 derniers jours</div>
          </CardContent>
        </Card>
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">En attente</CardTitle>
            <Clock className="w-4 h-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-xs text-yellow-400 mt-1">À valider</div>
          </CardContent>
        </Card>
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">Échecs</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-xs text-red-400 mt-1">À investiguer</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced panel */}
      <Card className="enhanced-card hover-ring">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-silver">Historique récent</CardTitle>
          <CardDescription>Exemple d'éléments (placeholder)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3">
                  <History className="w-4 h-4 text-gray-300" />
                  <div>
                    <div className="text-white text-sm">Transaction #{i}</div>
                    <div className="text-gray-400 text-xs">Investissement • €250,00</div>
                  </div>
                </div>
                <span className="text-green-400 text-xs">Confirmée</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactions;
