# 🔑 Configuration GitHub pour Netlify

## 1. Créer un Personal Access Token GitHub

### Étapes :
1. Allez sur GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Cliquez sur "Generate new token (classic)"
3. Donnez un nom : `crypto-arbitrage-netlify`
4. Sélectionnez les scopes :
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Cliquez sur "Generate token"
6. **COPIEZ LE TOKEN** (il ne sera affiché qu'une fois !)

## 2. Configurer les Variables d'Environnement Netlify

### Dans Netlify Dashboard :
1. Allez sur votre site → Site settings → Environment variables
2. Ajoutez ces variables :

```
GITHUB_TOKEN = votre_token_ici
GITHUB_REPO = votre-username/cryptocomarbitrage
GITHUB_OWNER = votre-username
```

## 3. Mettre à jour le Service GitHub

Le service `githubService.ts` doit être modifié pour utiliser les variables d'environnement Netlify.

## 4. Configuration du Repository

### Structure requise :
```
cryptocomarbitrage/
├── data/
│   ├── users.json
│   ├── wallets.json
│   ├── plans.json
│   ├── transactions.json
│   └── settings.json
└── src/
```

## 5. Permissions du Token

Le token doit avoir accès à :
- Lecture et écriture du repository
- Création de commits
- Mise à jour des fichiers JSON

## ⚠️ Sécurité

- Ne jamais exposer le token dans le code client
- Utiliser uniquement les variables d'environnement Netlify
- Le token doit être stocké de manière sécurisée
