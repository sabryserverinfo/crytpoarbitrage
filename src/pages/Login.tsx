import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import logoUrl from '../assets/crypto-logo.svg?url';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        // La redirection sera gérée par le composant ProtectedRoute
        navigate('/dashboard');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2300A3FF%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <img src={logoUrl} alt="Crypto Logo" className="w-14 h-14 rounded-2xl shadow-[0_8px_24px_rgba(0,163,255,0.45)] group-hover:scale-110 transition-transform duration-200" />
            <span className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
              Crypto Arbitrage
            </span>
          </Link>
        </div>

        <Card className="bg-dark-800/90 backdrop-blur-sm border-dark-700/50 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-white">Connexion</CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              Accédez à votre tableau de bord personnel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 font-medium">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-dark-700/50 border-dark-600 text-white placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 font-medium">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-dark-700/50 border-dark-600 text-white placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="border-t border-dark-700/50 pt-6">
              <div className="text-center space-y-4">
                <p className="text-gray-400 text-sm">
                  Pas encore de compte ?{' '}
                  <Link 
                    to="/register" 
                    className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
                  >
                    Créer un compte
                  </Link>
                </p>
                
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-3 font-medium">
                    Comptes de démonstration :
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Admin:</span>
                      <span className="text-primary-400 font-mono">alice@internal.dev</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Client:</span>
                      <span className="text-primary-400 font-mono">bob@internal.dev</span>
                    </div>
                    <div className="text-center text-gray-600 mt-2">
                      Mot de passe: <span className="font-mono">alice123</span> / <span className="font-mono">bob123</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link to="/" className="inline-flex items-center text-primary-500 hover:text-primary-400 text-sm transition-colors group">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
