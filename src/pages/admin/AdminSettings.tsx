import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gradient-silver tracking-tight">Paramètres Système</h1>
          <p className="text-gray-400">Configuration générale de la plateforme</p>
        </div>
      </div>

      <Card className="crypto-panel">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Général</CardTitle>
          <CardDescription>Options globales de l'application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-gray-400 text-sm">Interface nettoyée. Module détaillé à réinstaller prochainement.</div>
          <Button variant="outline">Sauvegarder</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
