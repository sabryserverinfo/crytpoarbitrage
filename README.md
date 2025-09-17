# Crypto-Arbitrage

Une application front-end complète pour la simulation d'arbitrage crypto avec interface client et administrateur.

## 🚀 Fonctionnalités

### Interface Client
- **Dashboard** : Vue d'ensemble du portefeuille avec graphiques et statistiques
- **Plans d'investissement** : Choix et souscription à des plans avec simulateur de rendement
- **Portefeuilles** : Gestion des actifs crypto avec adresses de dépôt
- **Transactions** : Historique complet avec filtres et recherche

### Interface Administrateur
- **Dashboard** : KPIs globaux, graphiques de croissance et répartition des actifs
- **Gestion des utilisateurs** : CRUD complet des comptes utilisateurs
- **Gestion des plans** : Création et modification des plans d'investissement
- **Gestion des portefeuilles** : Ajustement des soldes et adresses
- **Gestion des transactions** : Validation/rejet des opérations

### Fonctionnalités Techniques
- **Authentification** : Système de connexion avec rôles (client/admin)
- **Prix temps réel** : Intégration CoinAPI.io pour les cours crypto
- **Stockage décentralisé** : Données JSON sur GitHub
- **Design moderne** : Interface inspirée de Crypto.com avec mode sombre
- **Responsive** : Compatible mobile et desktop

## 🛠️ Stack Technique

- **Frontend** : React 18 + TypeScript + Vite
- **UI** : Tailwind CSS + shadcn/ui
- **Routing** : React Router DOM
- **Graphiques** : Recharts
- **Icônes** : Lucide React
- **API Crypto** : CoinAPI.io
- **Stockage** : GitHub (fichiers JSON)
- **Hébergement** : Netlify

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base
│   ├── Layout.tsx      # Layout principal avec navigation
│   └── ProtectedRoute.tsx
├── pages/              # Pages de l'application
│   ├── client/         # Pages client
│   ├── admin/          # Pages admin
│   ├── Home.tsx        # Page d'accueil
│   └── Login.tsx       # Page de connexion
├── services/           # Services API
│   ├── githubService.ts
│   └── coinapiService.ts
├── hooks/              # Hooks personnalisés
│   └── useAuth.tsx     # Hook d'authentification
├── types/              # Types TypeScript
└── utils/              # Utilitaires

data/                   # Fichiers JSON de données
├── users.json          # Utilisateurs
├── wallets.json        # Portefeuilles
├── plans.json          # Plans d'investissement
├── transactions.json   # Transactions
└── settings.json       # Configuration
```

## 🚀 Installation et Démarrage

1. **Cloner le projet**
```bash
git clone <repository-url>
cd cryptocomarbitrage
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le serveur de développement**
```bash
npm run dev
```

4. **Accéder à l'application**
```
http://localhost:5173
```

## 🔐 Comptes de Démonstration

### Administrateur
- **Email** : alice@internal.dev
- **Mot de passe** : alice123

### Client
- **Email** : bob@internal.dev
- **Mot de passe** : bob123

## 📊 Configuration des Données

### GitHub API
Pour utiliser le stockage GitHub, configurez dans `src/services/githubService.ts` :
- `GITHUB_REPO` : Votre repository GitHub
- `GITHUB_TOKEN` : Token d'accès personnel GitHub

### CoinAPI.io
La clé API est déjà configurée dans le projet :
- **Clé** : 50633be2-eacb-4814-9529-2b5497725bc1
- **Paires supportées** : BTC/EUR, ETH/EUR, USDT/EUR, USDC/EUR

## 🎨 Design

L'application utilise un design moderne inspiré de Crypto.com :
- **Palette** : Bleu nuit (#0033AD), Bleu électrique (#00A3FF), Fond sombre (#0A0F23)
- **Effets** : Glassmorphism, animations fluides
- **Typographie** : Inter (Google Fonts)
- **Responsive** : Mobile-first design

## 🚀 Déploiement Netlify

1. **Build de production**
```bash
npm run build
```

2. **Déploiement automatique**
- Connectez votre repository GitHub à Netlify
- Le fichier `netlify.toml` configure automatiquement le déploiement

## 📝 Structure des Données

### users.json
```json
[
  {
    "id": "u1",
    "name": "Alice",
    "email": "alice@internal.dev",
    "password": "alice123",
    "role": "admin"
  }
]
```

### wallets.json
```json
[
  {
    "user_id": "u2",
    "asset": "USDT",
    "balance": 1500,
    "deposit_address": "TXYZ123..."
  }
]
```

### plans.json
```json
[
  {
    "id": "plan001",
    "name": "Débutant",
    "asset": "USDT",
    "yield_percent": 8,
    "min_eur": 100,
    "max_eur": 1000,
    "duration_months": 6,
    "description": "Plan idéal pour débuter"
  }
]
```

## 🔧 Scripts Disponibles

- `npm run dev` : Serveur de développement
- `npm run build` : Build de production
- `npm run preview` : Prévisualisation du build
- `npm run lint` : Vérification du code

## 📄 Licence

Ce projet est destiné à un usage interne et éducatif.

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créez une branche feature
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.