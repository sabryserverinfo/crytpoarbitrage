# 🚀 Guide de Déploiement avec GitHub

## 📋 **Étapes de Configuration**

### **1. Créer le Repository GitHub**

```bash
# Créer un nouveau repository sur GitHub
# Nom : cryptocomarbitrage
# Visibilité : Private (recommandé)
```

### **2. Configurer le Personal Access Token**

1. **GitHub.com** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)**
3. **Nom** : `crypto-arbitrage-netlify`
4. **Scopes sélectionnés** :
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. **Generate token** et **COPIER LE TOKEN**

### **3. Configurer Netlify**

#### **Variables d'Environnement dans Netlify :**
```
VITE_GITHUB_REPO = votre-username/cryptocomarbitrage
VITE_GITHUB_TOKEN = votre_token_github_ici
```

#### **Comment ajouter les variables :**
1. **Netlify Dashboard** → **Votre site** → **Site settings**
2. **Environment variables** → **Add variable**
3. Ajouter les deux variables ci-dessus

### **4. Structure du Repository**

```
cryptocomarbitrage/
├── data/                    # 📁 Données JSON
│   ├── users.json
│   ├── wallets.json
│   ├── plans.json
│   ├── transactions.json
│   └── settings.json
├── src/                     # 📁 Code source
├── dist/                    # 📁 Build (généré par Netlify)
├── netlify.toml            # ⚙️ Configuration Netlify
├── _headers                # 🔒 Headers de sécurité
├── _redirects              # 🔄 Redirections SPA
└── package.json            # 📦 Dépendances
```

### **5. Déploiement**

#### **Option A : Déploiement automatique**
1. **Netlify** → **New site from Git**
2. **Connect to GitHub** → **Sélectionner votre repo**
3. **Build settings** :
   - Build command : `npm run build`
   - Publish directory : `dist`
4. **Deploy site**

#### **Option B : Déploiement manuel**
1. **Build local** : `npm run build`
2. **Upload du dossier `dist`** sur Netlify

### **6. Vérification**

#### **Test des fonctionnalités :**
- ✅ Connexion admin : `alice@internal.dev` / `alice123`
- ✅ Connexion client : `bob@internal.dev` / `bob123`
- ✅ Création de transactions
- ✅ Validation admin des transactions
- ✅ Mise à jour des données JSON

## 🔧 **Fonctionnement du Système**

### **Lecture des Données :**
```javascript
// Le service lit depuis GitHub Raw URL
const response = await fetch(`${BASE_URL}/${filename}`, {
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
  },
});
```

### **Écriture des Données :**
```javascript
// Le service écrit via GitHub REST API
const response = await fetch(`${BASE_URL}/${filename}`, {
  method: 'PUT',
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: `Update ${filename}`,
    content: encodedContent,
    sha: existingSha,
  }),
});
```

## ⚠️ **Sécurité**

### **Bonnes Pratiques :**
- ✅ Token GitHub stocké dans les variables d'environnement Netlify
- ✅ Repository privé
- ✅ Token avec permissions minimales
- ✅ Pas d'exposition du token dans le code client

### **Limitations :**
- ⚠️ Les données sont publiques si le repo est public
- ⚠️ Rate limiting GitHub API (5000 req/h)
- ⚠️ Pas de validation côté serveur

## 🎯 **Résultat Final**

Une fois configuré, votre application :
- ✅ Lit les données depuis GitHub
- ✅ Écrit les modifications via GitHub API
- ✅ Fonctionne entièrement depuis Netlify
- ✅ Pas de serveur backend requis
- ✅ Données persistantes dans GitHub
