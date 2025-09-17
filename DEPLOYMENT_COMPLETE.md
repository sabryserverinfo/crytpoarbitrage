# 🚀 Guide Complet de Déploiement

## 📋 **Étapes de Déploiement**

### **1. Installer Git (si pas déjà fait)**
- Téléchargez depuis : https://git-scm.com/download/win
- Installez avec les paramètres par défaut
- Redémarrez votre terminal

### **2. Pousser le Code sur GitHub**

#### **Option A : Script Automatique (Recommandé)**
```powershell
# Exécutez le script PowerShell
.\push-to-github.ps1
```

#### **Option B : Commandes Manuelles**
```bash
# Initialiser Git
git init

# Configurer Git (première fois seulement)
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Ajouter le remote
git remote add origin https://github.com/mathieugscsolicitors/arbitrage-cryptocom.git

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: Crypto-Arbitrage application"

# Pousser sur GitHub
git push -u origin main
```

### **3. Vérifier sur GitHub**
- Allez sur : https://github.com/mathieugscsolicitors/arbitrage-cryptocom
- Vérifiez que tous les fichiers sont présents :
  - ✅ Dossier `data/` avec les JSON
  - ✅ Dossier `src/` avec le code
  - ✅ Fichiers de configuration

### **4. Déployer sur Netlify**

#### **Déploiement Automatique :**
1. **Netlify.com** → **New site from Git**
2. **Connect to GitHub** → **Sélectionner** `mathieugscsolicitors/arbitrage-cryptocom`
3. **Build settings** :
   - Build command : `npm run build`
   - Publish directory : `dist`
4. **Deploy site**

#### **Déploiement Manuel :**
1. **Build local** : `npm run build`
2. **Upload du dossier `dist`** sur Netlify

## 🧪 **Tests de Validation**

### **Comptes de Test :**
- **Admin** : `alice@internal.dev` / `alice123`
- **Client 1** : `bob@internal.dev` / `bob123`
- **Client 2** : `charlie@internal.dev` / `charlie123`

### **Fonctionnalités à Tester :**
- ✅ Connexion/déconnexion
- ✅ Dashboard client avec solde en EUR
- ✅ Plans d'investissement avec simulateur
- ✅ Portefeuilles avec adresses de dépôt
- ✅ Transactions avec filtres
- ✅ Interface admin complète
- ✅ Validation/rejet des transactions
- ✅ Mise à jour des données JSON

## 🔧 **Configuration GitHub**

### **Repository :**
- **URL** : `https://github.com/mathieugscsolicitors/arbitrage-cryptocom.git`
- **Token API** : `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`
- **Status** : ✅ Testé et fonctionnel

### **Fonctionnement :**
- **Lecture** : GitHub Raw URL (public)
- **Écriture** : GitHub REST API (avec token)
- **Persistance** : Données sauvegardées dans GitHub

## 🎯 **Résultat Final**

Une fois déployé, votre application :
- ✅ **Fonctionne entièrement** depuis Netlify
- ✅ **Lit et écrit** sur GitHub automatiquement
- ✅ **Pas de serveur backend** requis
- ✅ **Données persistantes** dans GitHub
- ✅ **Interface complète** admin + client
- ✅ **Design responsive** mobile-first
- ✅ **Prix crypto temps réel** via CoinAPI.io

## 🚀 **Prêt pour la Production !**

Votre application Crypto-Arbitrage est maintenant **100% prête** pour le déploiement et l'utilisation en production !
