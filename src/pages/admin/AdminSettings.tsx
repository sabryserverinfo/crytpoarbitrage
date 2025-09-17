import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Settings, Shield, Database, Bell, Palette, Globe } from 'lucide-react';

const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gradient-silver tracking-tight mb-2">
            Paramètres Système
          </h1>
          <p className="text-gray-400 text-lg">Configuration générale de la plateforme</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="btn-primary glow-primary">
            <Settings className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Security Settings */}
        <Card className="enhanced-card hover-ring">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-gradient-silver">Sécurité</CardTitle>
                <CardDescription>Paramètres de sécurité</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-gray-400 text-sm">Configuration des accès et authentification</div>
              <Button variant="outline" size="sm" className="w-full">Configurer</Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card className="enhanced-card hover-ring">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-gradient-silver">Base de données</CardTitle>
                <CardDescription>Gestion des données</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-gray-400 text-sm">Sauvegarde et maintenance</div>
              <Button variant="outline" size="sm" className="w-full">Gérer</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="enhanced-card hover-ring">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <Bell className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-gradient-silver">Notifications</CardTitle>
                <CardDescription>Alertes système</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-gray-400 text-sm">Configuration des alertes</div>
              <Button variant="outline" size="sm" className="w-full">Paramétrer</Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="enhanced-card hover-ring">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-gradient-silver">Thème</CardTitle>
                <CardDescription>Apparence</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-gray-400 text-sm">Personnalisation de l'interface</div>
              <Button variant="outline" size="sm" className="w-full">Modifier</Button>
            </div>
          </CardContent>
        </Card>

        {/* Localization */}
        <Card className="enhanced-card hover-ring">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500/20 to-teal-500/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-gradient-silver">Localisation</CardTitle>
                <CardDescription>Langue et région</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-gray-400 text-sm">Paramètres régionaux</div>
              <Button variant="outline" size="sm" className="w-full">Configurer</Button>
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card className="enhanced-card hover-ring">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-500/20 to-slate-500/20 flex items-center justify-center">
                <Settings className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-gradient-silver">Général</CardTitle>
                <CardDescription>Options globales</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-gray-400 text-sm">Configuration générale de l'application</div>
              <Button variant="outline" size="sm" className="w-full">Modifier</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="enhanced-card hover-ring glow-primary">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-primary flex items-center">
            <Shield className="w-6 h-6 mr-3" />
            État du Système
          </CardTitle>
          <CardDescription>Surveillance en temps réel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400 mb-1">99.9%</div>
              <div className="text-sm text-gray-400">Disponibilité</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400 mb-1">1.2s</div>
              <div className="text-sm text-gray-400">Temps de réponse</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400 mb-1">Active</div>
              <div className="text-sm text-gray-400">Statut</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
