import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Wallet, TrendingUp, Clock, Target } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gradient-silver tracking-tight mb-1">Tableau de bord</h1>
          <p className="text-gray-400">Aperçu rapide de votre compte</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="btn-primary glow-primary">Nouvelle opération</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">Solde total</CardTitle>
            <Wallet className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">€12 450,32</div>
            <div className="text-xs text-green-400 mt-1">+2.3% cette semaine</div>
          </CardContent>
        </Card>

        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">ROI global</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+8.14%</div>
            <div className="text-xs text-blue-400 mt-1">Sur 30 jours</div>
          </CardContent>
        </Card>

        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">Investissements</CardTitle>
            <Target className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">€7 500,00</div>
            <div className="text-xs text-purple-400 mt-1">3 plans actifs</div>
          </CardContent>
        </Card>

        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">En attente</CardTitle>
            <Clock className="w-4 h-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2</div>
            <div className="text-xs text-yellow-400 mt-1">Transactions</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced panel */}
      <Card className="enhanced-card hover-ring">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-silver">Aperçu rapide</CardTitle>
          <CardDescription>Dernières activités et actions disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-gray-300 text-sm">Dernière transaction</div>
              <div className="text-white font-semibold mt-1">Investissement • €1 000,00</div>
              <div className="text-gray-400 text-xs mt-1">Confirmée il y a 2h</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-gray-300 text-sm">Prochain objectif</div>
              <div className="text-white font-semibold mt-1">Atteindre €15 000</div>
              <div className="text-gray-400 text-xs mt-1">Estimation 10 jours</div>
            </div>
          </div>
          <div className="mt-6">
            <Button className="btn-primary glow-primary">Voir les transactions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
