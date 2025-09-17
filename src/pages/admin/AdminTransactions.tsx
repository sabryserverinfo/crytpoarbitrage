import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const AdminTransactions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gradient-silver tracking-tight">Transactions</h1>
          <p className="text-gray-400">Suivi des opérations et états</p>
        </div>
      </div>

      <Card className="crypto-panel">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Historique</CardTitle>
          <CardDescription>Module détaillé à réinstaller</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400 text-sm">Interface nettoyée. Les duplications ont été supprimées.</div>
          <div className="mt-4"><Button variant="outline">Actualiser</Button></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactions;
