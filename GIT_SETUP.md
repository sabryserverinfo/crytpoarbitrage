# 🔧 Installation et Configuration Git

## 📥 **Étape 1 : Installer Git**

### **Option A : Téléchargement direct**
1. Allez sur : https://git-scm.com/download/win
2. Téléchargez la version Windows
3. Installez avec les paramètres par défaut
4. Redémarrez votre terminal

### **Option B : Via Chocolatey (si installé)**
```powershell
choco install git
```

### **Option C : Via Winget (Windows 10/11)**
```powershell
winget install --id Git.Git -e --source winget
```

## ⚙️ **Étape 2 : Configuration Git**

Après installation, ouvrez un nouveau terminal et configurez :

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

## 🚀 **Étape 3 : Pousser le Code**

Une fois Git installé, exécutez ces commandes dans le dossier du projet :

```bash
# Initialiser le repository
git init

# Ajouter le remote
git remote add origin https://github.com/mathieugscsolicitors/arbitrage-cryptocom.git

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: Crypto-Arbitrage application"

# Pousser sur GitHub
git push -u origin main
```

## 📋 **Fichiers à Ignorer**

Créez un fichier `.gitignore` avec ce contenu :

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

## ✅ **Vérification**

Après le push, vérifiez sur GitHub :
- ✅ Tous les fichiers sont présents
- ✅ Le dossier `data/` contient les JSON
- ✅ La structure est correcte
