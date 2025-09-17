# 🚀 GUIDE DE DÉPLOIEMENT - CRYPTO-ARBITRAGE

## 📋 Prérequis

1. **Compte GitHub** avec repository créé
2. **Compte Netlify** (gratuit)
3. **Repository GitHub** avec le code source

## 🔧 Étapes de Déploiement

### 1. Préparation du Repository GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: Crypto-Arbitrage MVP"

# Ajouter le remote GitHub
git remote add origin https://github.com/VOTRE-USERNAME/cryptocomarbitrage.git

# Pousser vers GitHub
git push -u origin main
```

### 2. Configuration Netlify

1. **Connecter GitHub**
   - Aller sur [netlify.com](https://netlify.com)
   - Cliquer sur "New site from Git"
   - Choisir "GitHub"
   - Autoriser Netlify à accéder à votre repository

2. **Configuration du Build**
   - **Repository** : Votre repository GitHub
   - **Branch** : `main`
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`

3. **Variables d'Environnement** (optionnel)
   - Si vous voulez utiliser GitHub API, ajouter :
     - `GITHUB_TOKEN` : Votre token GitHub
     - `GITHUB_REPO` : Votre repository (ex: username/cryptocomarbitrage)

### 3. Déploiement Automatique

Une fois configuré, Netlify :
- ✅ Détecte automatiquement les changements
- ✅ Rebuild automatiquement à chaque push
- ✅ Déploie automatiquement
- ✅ Fournit une URL HTTPS

## 🔑 Comptes de Test

### Administrateur
- **Email** : `alice@internal.dev`
- **Mot de passe** : `alice123`
- **Accès** : Toutes les fonctionnalités admin

### Client
- **Email** : `bob@internal.dev`
- **Mot de passe** : `bob123`
- **Accès** : Interface client complète

### Client 2
- **Email** : `charlie@internal.dev`
- **Mot de passe** : `charlie123`
- **Accès** : Interface client complète

## 🎯 Fonctionnalités à Tester

### Interface Client
1. **Dashboard** : Vérifier les graphiques et statistiques
2. **Plans** : Tester le simulateur de rendement
3. **Portefeuilles** : Vérifier les soldes et adresses
4. **Transactions** : Tester les filtres et recherche

### Interface Admin
1. **Dashboard** : Vérifier les KPIs globaux
2. **Utilisateurs** : Tester CRUD complet
3. **Plans** : Créer/modifier des plans
4. **Portefeuilles** : Ajuster les soldes
5. **Transactions** : Valider/rejeter des transactions
6. **Paramètres** : Modifier la configuration

## 📱 Test Mobile

1. **Responsive Design** : Tester sur différentes tailles d'écran
2. **Menu Hamburger** : Vérifier la navigation mobile
3. **Touch Interactions** : Tester les boutons et formulaires
4. **Performance** : Vérifier la vitesse de chargement

## 🔧 Configuration GitHub API (Optionnel)

Si vous voulez utiliser le stockage GitHub réel :

1. **Créer un Token GitHub**
   - Aller dans Settings > Developer settings > Personal access tokens
   - Générer un nouveau token avec permissions `repo`

2. **Modifier le Service**
   ```typescript
   // Dans src/services/githubService.ts
   const GITHUB_REPO = 'votre-username/cryptocomarbitrage';
   const GITHUB_TOKEN = 'votre-token-github';
   ```

3. **Ajouter les Variables Netlify**
   - `GITHUB_TOKEN` : Votre token
   - `GITHUB_REPO` : Votre repository

## 🚨 Dépannage

### Problèmes Courants

1. **Build Failed**
   - Vérifier que Node.js 18+ est utilisé
   - Vérifier les dépendances dans package.json

2. **404 sur les Routes**
   - Vérifier que _redirects est présent
   - Vérifier la configuration netlify.toml

3. **Erreurs API**
   - Vérifier la clé CoinAPI.io
   - Vérifier la configuration GitHub (si utilisée)

### Logs Netlify
- Aller dans Site settings > Build & deploy > Build logs
- Vérifier les erreurs de build

## 🎉 Post-Déploiement

Une fois déployé :

1. **Tester toutes les fonctionnalités**
2. **Vérifier la performance mobile**
3. **Tester les comptes de démonstration**
4. **Vérifier les intégrations API**

## 📞 Support

En cas de problème :
1. Vérifier les logs Netlify
2. Tester en local avec `npm run dev`
3. Vérifier la configuration GitHub/Netlify

---

**🎯 Votre application Crypto-Arbitrage est maintenant prête pour la production !**
