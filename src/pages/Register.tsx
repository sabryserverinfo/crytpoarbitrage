import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { userService, walletService } from '../services/githubService';
import { Loader2, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import logoUrl from '../assets/crypto-logo.svg?url';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      // Vérifier si l'email existe déjà
      const existingUsers = await userService.getAll();
      const emailExists = existingUsers.some(user => user.email === formData.email);
      
      if (emailExists) {
        setError('Cette adresse email est déjà utilisée');
        setLoading(false);
        return;
      }

      // Créer l'utilisateur
      const newUser = {
        id: `u${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user' as const
      };

      await userService.create(newUser);

      // Créer les portefeuilles pour l'utilisateur
      const assets = ['BTC', 'ETH', 'USDT', 'USDC'];
      for (const asset of assets) {
        await walletService.create({
          user_id: newUser.id,
          asset: asset,
          balance: 0,
          deposit_address: `${asset.toLowerCase()}_${newUser.id}_${Date.now()}`
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setError('Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <Card className="w-full max-w-md enhanced-card hover-ring text-white">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-pulse" />
              <h2 className="text-2xl font-bold text-white">Inscription réussie !</h2>
              <p className="text-gray-400">
                Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion.
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2300A3FF%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <Card className="w-full max-w-md enhanced-card hover-ring text-white relative z-10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4">
            <img src={logoUrl} alt="Crypto Logo" className="w-16 h-16 rounded-2xl shadow-[0_8px_24px_rgba(0,163,255,0.45)]" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-gradient-silver tracking-tight">
            Crypto Arbitrage
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            Créez votre compte et commencez à investir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 font-medium">Nom complet</Label>
              <Input
                id="name"
                type="text"
                placeholder="Votre nom complet"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="bg-dark-700/50 border-dark-600 text-white placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="bg-dark-700/50 border-dark-600 text-white placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-medium">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 caractères"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="bg-dark-700/50 border-dark-600 text-white placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300 font-medium">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Répétez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  className="bg-dark-700/50 border-dark-600 text-white placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-primary-500/25" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création du compte...
                </>
              ) : (
                'Créer mon compte'
              )}
            </Button>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Déjà un compte ?{' '}
                <Link 
                  to="/login" 
                  className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
