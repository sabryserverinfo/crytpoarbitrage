import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, UserPlus, Search, Shield } from 'lucide-react';

const AdminUsers: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gradient-silver tracking-tight mb-1">Utilisateurs</h1>
          <p className="text-gray-400">Gestion des comptes et rôles</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="btn-primary glow-primary"><UserPlus className="w-4 h-4 mr-2"/>Nouveau</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">Total</CardTitle>
            <Users className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">128</div>
            <div className="text-xs text-blue-400 mt-1">Utilisateurs</div>
          </CardContent>
        </Card>
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">Actifs</CardTitle>
            <Shield className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">121</div>
            <div className="text-xs text-green-400 mt-1">Vérifiés</div>
          </CardContent>
        </Card>
        <Card className="stat-card hover-ring">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-400">En attente</CardTitle>
            <Search className="w-4 h-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">7</div>
            <div className="text-xs text-yellow-400 mt-1">Vérification KYC</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced panel */}
      <Card className="enhanced-card hover-ring">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-silver">Actions rapides</CardTitle>
          <CardDescription>Outils d'administration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="btn-primary glow-primary">Inviter un utilisateur</Button>
            <Button className="btn-primary glow-primary">Exporter la liste</Button>
            <Button className="btn-primary glow-primary">Appliquer des rôles</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
