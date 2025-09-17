import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { settingsService } from '../../services/githubService';
import type { Settings } from '../../types';
import { 
  Save, 
  RefreshCw,
  Key,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    coingecko_api_key: '',
    cache_duration: 60,
    default_currency: 'EUR',
    app_name: 'Crypto-Arbitrage',
    version: '1.0.0',
    maintenance_mode: false,
    features: {
      arbitrage_simulation: true,
      real_time_prices: true,
      admin_panel: true,
      user_registration: false
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsData = await settingsService.get();
      setSettings(settingsData);
      setFormData({
        coingecko_api_key: settingsData.coingecko_api_key,
        cache_duration: settingsData.cache_duration,
        default_currency: settingsData.default_currency,
        app_name: settingsData.app_name,
        version: settingsData.version,
        maintenance_mode: settingsData.maintenance_mode,
        features: settingsData.features
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsService.update(formData);
      await loadSettings();
      alert('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser les paramètres ?')) return;
    loadSettings();
  };

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
      <div>
        <h1 className="text-3xl font-bold text-white">Paramètres</h1>
        <p className="text-gray-400">Configurez les paramètres globaux de l'application</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* API Configuration */}
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              <Key className="w-5 h-5" />
              <span>Configuration API</span>
            </CardTitle>
            <CardDescription>
              Paramètres des services externes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coingecko_api_key">Clé API CoinGecko</Label>
              <Input
                id="coingecko_api_key"
                type="password"
                value={formData.coingecko_api_key}
                onChange={(e) => setFormData({...formData, coingecko_api_key: e.target.value})}
                placeholder="Votre clé API CoinGecko"
                required
              />
              <p className="text-sm text-gray-400">
                Clé API pour récupérer les prix crypto en temps réel
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cache_duration">Durée du cache (secondes)</Label>
              <Input
                id="cache_duration"
                type="number"
                value={formData.cache_duration}
                onChange={(e) => setFormData({...formData, cache_duration: parseInt(e.target.value)})}
                min="1"
                max="3600"
                required
              />
              <p className="text-sm text-gray-400">
                Durée de mise en cache des prix crypto (1-3600 secondes)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              <Globe className="w-5 h-5" />
              <span>Paramètres de l'Application</span>
            </CardTitle>
            <CardDescription>
              Configuration générale de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="app_name">Nom de l'application</Label>
                <Input
                  id="app_name"
                  value={formData.app_name}
                  onChange={(e) => setFormData({...formData, app_name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({...formData, version: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_currency">Devise par défaut</Label>
              <select
                id="default_currency"
                value={formData.default_currency}
                onChange={(e) => setFormData({...formData, default_currency: e.target.value})}
                className="w-full h-10 px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar US (USD)</option>
                <option value="GBP">Livre Sterling (GBP)</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="maintenance_mode"
                checked={formData.maintenance_mode}
                onChange={(e) => setFormData({...formData, maintenance_mode: e.target.checked})}
                className="w-4 h-4 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
              />
              <Label htmlFor="maintenance_mode">Mode maintenance</Label>
            </div>
            <p className="text-sm text-gray-400">
              Active le mode maintenance pour bloquer l'accès aux utilisateurs
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              <Zap className="w-5 h-5" />
              <span>Fonctionnalités</span>
            </CardTitle>
            <CardDescription>
              Activez ou désactivez les fonctionnalités de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="arbitrage_simulation"
                  checked={formData.features.arbitrage_simulation}
                  onChange={(e) => setFormData({
                    ...formData, 
                    features: {...formData.features, arbitrage_simulation: e.target.checked}
                  })}
                  className="w-4 h-4 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                />
                <Label htmlFor="arbitrage_simulation">Simulation d'arbitrage</Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="real_time_prices"
                  checked={formData.features.real_time_prices}
                  onChange={(e) => setFormData({
                    ...formData, 
                    features: {...formData.features, real_time_prices: e.target.checked}
                  })}
                  className="w-4 h-4 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                />
                <Label htmlFor="real_time_prices">Prix en temps réel</Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="admin_panel"
                  checked={formData.features.admin_panel}
                  onChange={(e) => setFormData({
                    ...formData, 
                    features: {...formData.features, admin_panel: e.target.checked}
                  })}
                  className="w-4 h-4 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                />
                <Label htmlFor="admin_panel">Panneau d'administration</Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="user_registration"
                  checked={formData.features.user_registration}
                  onChange={(e) => setFormData({
                    ...formData, 
                    features: {...formData.features, user_registration: e.target.checked}
                  })}
                  className="w-4 h-4 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                />
                <Label htmlFor="user_registration">Inscription utilisateur</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex space-x-3">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetSettings}
                disabled={saving}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* System Info */}
      <Card className="bg-dark-800/60 border-dark-700/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            <Shield className="w-5 h-5" />
            <span>Informations Système</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Version de l'application</p>
              <p className="text-white font-medium">{settings?.version || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Dernière mise à jour</p>
              <p className="text-white font-medium">
                {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Mode maintenance</p>
              <p className={`font-medium ${settings?.maintenance_mode ? 'text-red-400' : 'text-green-400'}`}>
                {settings?.maintenance_mode ? 'Activé' : 'Désactivé'}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Cache des prix</p>
              <p className="text-white font-medium">
                {settings?.cache_duration || 60} secondes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
