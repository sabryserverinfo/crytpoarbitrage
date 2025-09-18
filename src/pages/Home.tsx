import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Zap, ArrowRight, Star, Users, DollarSign, BarChart3 } from 'lucide-react';
import logoUrl from '../assets/crypto-logo.svg?url';
import { planService } from '../services/githubService';
import type { Plan } from '../types';
import { coinapiService } from '../services/coinapiService';

const Home: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(false);
  const [tickerPrices, setTickerPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoadingPlans(true);
        const data = await planService.getAll();
        setPlans(data);
      } catch (e) {
        console.error('Failed to load plans:', e);
      } finally {
        setLoadingPlans(false);
      }
    };
    loadPlans();
  }, []);

  useEffect(() => {
    const assets = ['BTC','ETH','USDT'];
    const fetchPrices = async () => {
      try {
        const prices = await coinapiService.getPrices(assets);
        setTickerPrices(prices);
      } catch (e) {
        console.error('Failed to load ticker prices:', e);
      }
    };
    fetchPrices();
    const id = setInterval(fetchPrices, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2300A3FF%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logoUrl} alt="Crypto Logo" className="w-10 h-10 rounded-xl shadow-[0_6px_20px_rgba(0,163,255,0.45)]" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
              Crypto Arbitrage
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/register">
              <Button variant="outline" className="border-primary-500/30 text-primary-400 hover:bg-primary-500/10 transition-all duration-200">
                S'inscrire
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white shadow-lg hover:shadow-primary-500/25 transition-all duration-200">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Price Ticker */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['BTC','ETH','USDT'].map((asset) => (
            <div 
              key={asset} 
              className="flex items-center justify-between px-4 py-2 text-sm text-gray-300"
              style={{
                background: 'linear-gradient(135deg, rgba(22, 26, 30, 0.9) 0%, rgba(46, 49, 57, 0.8) 100%)',
                border: '1px solid rgba(247, 147, 26, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#f7931a';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(247, 147, 26, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(247, 147, 26, 0.2)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span className="font-medium">
                {asset}
              </span>
              <span className="text-white font-semibold">
                {tickerPrices[asset]?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-primary-500" />
            <span className="text-primary-400 text-sm font-medium">Plateforme d'arbitrage crypto #1</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Votre meilleur
            <span className="block bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Agent d'Arbitrage
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Maximisez vos profits avec notre plateforme d'arbitrage crypto automatisée. 
            <span className="text-primary-400 font-semibold">Des rendements optimisés</span>, une sécurité maximale, 
            et une interface intuitive.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white shadow-2xl hover:shadow-primary-500/25 transition-all duration-200 transform hover:scale-105">
                Commencer gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-primary-500/30 text-primary-400 hover:bg-primary-500/10 transition-all duration-200">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pourquoi choisir 
            <span className="bg-gradient-to-r from-primary-500 to-blue-500 bg-clip-text text-transparent"> Crypto-Arbitrage</span> ?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Une plateforme révolutionnaire qui combine technologie de pointe et simplicité d'utilisation
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div 
            className="transition-all duration-300 group hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(22, 26, 30, 0.9) 0%, rgba(46, 49, 57, 0.8) 100%)',
              border: '1px solid rgba(247, 147, 26, 0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              padding: '24px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#f7931a';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(247, 147, 26, 0.3)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(247, 147, 26, 0.2)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-2xl text-white mb-2">Architecture Décentralisée</h3>
              <p className="text-gray-400 text-lg mb-4">
                Architecture 100% front-end avec stockage décentralisé sur GitHub
              </p>
            </div>
            <div>
              <p className="text-gray-300 leading-relaxed">
                Aucun serveur à maintenir, aucune donnée sensible stockée. 
                Tout fonctionne directement depuis votre navigateur avec une sécurité maximale.
              </p>
            </div>
          </div>

          <div 
            className="transition-all duration-300 group hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(22, 26, 30, 0.9) 0%, rgba(46, 49, 57, 0.8) 100%)',
              border: '1px solid rgba(247, 147, 26, 0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              padding: '24px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#f7931a';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(247, 147, 26, 0.3)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(247, 147, 26, 0.2)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl text-white mb-2">Données Temps Réel</h3>
              <p className="text-gray-400 text-lg mb-4">
                Prix crypto en temps réel via CoinGecko API
              </p>
            </div>
            <div>
              <p className="text-gray-300 leading-relaxed">
                Suivez les fluctuations du marché en temps réel avec des données 
                précises et actualisées toutes les minutes pour des décisions optimales.
              </p>
            </div>
          </div>

          <div 
            className="transition-all duration-300 group hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(22, 26, 30, 0.9) 0%, rgba(46, 49, 57, 0.8) 100%)',
              border: '1px solid rgba(247, 147, 26, 0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              padding: '24px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#f7931a';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(247, 147, 26, 0.3)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(247, 147, 26, 0.2)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-2xl text-white mb-2">Interface Premium</h3>
              <p className="text-gray-400 text-lg mb-4">
                Design moderne inspiré de Crypto.com
              </p>
            </div>
            <div>
              <p className="text-gray-300 leading-relaxed">
                Une interface intuitive et élégante qui vous permet de gérer 
                vos investissements en toute simplicité avec un design premium.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nos <span className="bg-gradient-to-r from-primary-500 to-blue-500 bg-clip-text text-transparent">Plans</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choisissez le plan d'arbitrage qui correspond à vos objectifs
          </p>
        </div>

        {loadingPlans ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className="enhanced-card hover-ring transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-baseline justify-between">
                    <span>{plan.name}</span>
                    <span className="text-primary-400 text-xl">{plan.yield_percent}%</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Durée: {plan.duration_months} mois • Actif: {plan.asset}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-gray-300">
                      <span>Investissement min.</span>
                      <span className="text-white font-medium">{plan.min_eur.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <span>Investissement max.</span>
                      <span className="text-white font-medium">{plan.max_eur.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {plan.description}
                    </p>
                    <Link to="/register">
                      <Button className="w-full bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white shadow-lg hover:shadow-primary-500/25">
                        Démarrer avec ce plan
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Partners Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            Exchanges partenaires
          </h3>
          <p className="text-gray-400 mt-2">Intégrations multiples pour une exécution optimale</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
          {['Binance','OKX','Bybit','Kraken','Bitget'].map((name) => (
            <div 
              key={name} 
              className="h-16 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              style={{
                background: 'linear-gradient(135deg, rgba(22, 26, 30, 0.9) 0%, rgba(46, 49, 57, 0.8) 100%)',
                border: '1px solid rgba(247, 147, 26, 0.2)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#f7931a';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(247, 147, 26, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(247, 147, 26, 0.2)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span className="text-sm md:text-base font-medium">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Ils nous font confiance</h3>
          <p className="text-gray-400 mt-2">Retours d'expérience de nos utilisateurs</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <Card key={i} className="enhanced-card hover-ring transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 border border-primary-500/30" />
                  <div>
                    <p className="text-white font-medium">Utilisateur {i}</p>
                    <p className="text-gray-400 text-sm">Investisseur</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  “Interface ultra fluide et résultats réguliers. L'arbitrage automatisé m'a permis de stabiliser mes rendements.”
                </p>
                <div className="flex items-center space-x-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white">FAQ</h3>
          <p className="text-gray-400 mt-2">Questions les plus fréquentes</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { q: "Qu'est-ce que l'arbitrage crypto ?", a: "Acheter et vendre le même actif sur différents exchanges pour profiter des écarts de prix." },
            { q: "Puis-je retirer à tout moment ?", a: "Oui, les retraits sont possibles. Les demandes passent en revue avant confirmation." },
            { q: "Les prix sont-ils en temps réel ?", a: "Nous utilisons des données actualisées chaque minute pour un suivi précis." },
            { q: "Comment choisir mon plan ?", a: "Sélectionnez selon votre horizon (durée) et votre budget (min/max)." }
          ].map((item, idx) => (
            <Card key={idx} className="enhanced-card hover-ring transition-colors">
              <CardHeader>
                <CardTitle className="text-white text-lg">{item.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{item.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Roadmap</h3>
          <p className="text-gray-400 mt-2">Ce qui arrive prochainement</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[{
            title: 'Phase 1', desc: 'Optimisation du moteur de pricing et caching avancé.'
          },{
            title: 'Phase 2', desc: 'Nouvelles intégrations exchanges et dashboard avancé.'
          },{
            title: 'Phase 3', desc: 'Fonctionnalités sociales et API publique.'
          }].map((step, idx) => (
            <Card key={idx} className="enhanced-card hover-ring transition-colors">
              <CardHeader>
                <CardTitle className="text-white text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="group">
            <div className="bg-gradient-to-br from-primary-500/10 to-blue-500/10 rounded-2xl p-8 border border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 group-hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary-500 to-blue-500 bg-clip-text text-transparent mb-3">100%</div>
              <div className="text-gray-300 text-lg font-medium">Front-end</div>
              <div className="text-gray-500 text-sm mt-2">Architecture décentralisée</div>
            </div>
          </div>
          <div className="group">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group-hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-3">24/7</div>
              <div className="text-gray-300 text-lg font-medium">Surveillance</div>
              <div className="text-gray-500 text-sm mt-2">Monitoring continu</div>
            </div>
          </div>
          <div className="group">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group-hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">0€</div>
              <div className="text-gray-300 text-lg font-medium">Frais cachés</div>
              <div className="text-gray-500 text-sm mt-2">Transparence totale</div>
            </div>
          </div>
          <div className="group">
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-8 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 group-hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-3">∞</div>
              <div className="text-gray-300 text-lg font-medium">Possibilités</div>
              <div className="text-gray-500 text-sm mt-2">Potentiel illimité</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <Card className="max-w-4xl mx-auto enhanced-card hover-ring">
          <CardHeader className="pb-8">
            <CardTitle className="text-4xl md:text-5xl font-bold text-white mb-4">
              Prêt à révolutionner vos 
              <span className="bg-gradient-to-r from-primary-500 to-blue-500 bg-clip-text text-transparent"> investissements</span> ?
            </CardTitle>
            <CardDescription className="text-xl text-gray-300 max-w-2xl mx-auto">
              Rejoignez notre plateforme et commencez à maximiser vos profits dès aujourd'hui. 
              Inscription gratuite et sans engagement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white shadow-2xl hover:shadow-primary-500/25 transition-all duration-200 transform hover:scale-105">
                  Créer mon compte gratuit
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-primary-500/30 text-primary-400 hover:bg-primary-500/10 transition-all duration-200">
                  Se connecter
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-8 pt-6">
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="w-5 h-5" />
                <span className="text-sm">+1000 utilisateurs</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm">€0 frais cachés</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Shield className="w-5 h-5" />
                <span className="text-sm">100% sécurisé</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-16 border-t border-dark-700/50 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src={logoUrl} alt="Crypto Logo" className="w-8 h-8 rounded-lg shadow-[0_4px_16px_rgba(0,163,255,0.45)]" />
              <span className="text-xl font-extrabold text-white tracking-tight">Crypto Arbitrage</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              La plateforme d'arbitrage crypto la plus avancée et sécurisée du marché.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Plateforme</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Accueil</Link></li>
              <li><Link to="/register" className="hover:text-primary-400 transition-colors">S'inscrire</Link></li>
              <li><Link to="/login" className="hover:text-primary-400 transition-colors">Se connecter</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-primary-400 transition-colors cursor-pointer">Documentation</span></li>
              <li><span className="hover:text-primary-400 transition-colors cursor-pointer">FAQ</span></li>
              <li><span className="hover:text-primary-400 transition-colors cursor-pointer">Contact</span></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-primary-400 transition-colors cursor-pointer">Conditions d'utilisation</span></li>
              <li><span className="hover:text-primary-400 transition-colors cursor-pointer">Politique de confidentialité</span></li>
              <li><span className="hover:text-primary-400 transition-colors cursor-pointer">Mentions légales</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-dark-700/50 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 Crypto-Arbitrage. Tous droits réservés. | 
            <span className="text-primary-400"> Plateforme d'arbitrage crypto automatisée</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
