import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CreditCard, ArrowRight, Star } from 'lucide-react';

const ClientPlans: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gradient-silver tracking-tight mb-1">Plans</h1>
          <p className="text-gray-400">Choisissez un plan adapté à vos objectifs</p>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{name:'Starter',yield:'+3%/mois',min:'€250',badge:'Populaire'},{name:'Pro',yield:'+5%/mois',min:'€1 000',badge:'Recommandé'},{name:'Elite',yield:'+7%/mois',min:'€5 000',badge:'Premium'}].map((p,idx)=> (
          <Card key={idx} className="enhanced-card hover-ring">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-gradient-silver">{p.name}</CardTitle>
                <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20 text-gray-300">{p.badge}</span>
              </div>
              <CardDescription className="text-gray-300">
                Rendement attendu <span className="text-white font-semibold">{p.yield}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-gray-400 text-sm">Investissement minimum</div>
                  <div className="text-white font-semibold">{p.min}</div>
                </div>
                <Button className="w-full btn-primary glow-primary">
                  Souscrire <ArrowRight className="w-4 h-4 ml-2"/>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card className="enhanced-card hover-ring">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-silver flex items-center">
            <CreditCard className="w-5 h-5 mr-2"/> Besoin d'aide pour choisir ?
          </CardTitle>
          <CardDescription>Nous pouvons vous recommander un plan selon votre budget</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="btn-primary glow-primary">Obtenir une recommandation</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPlans;
