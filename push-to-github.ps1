# 🚀 Script PowerShell pour pousser sur GitHub
# Exécutez ce script après avoir installé Git

Write-Host "🚀 Déploiement sur GitHub - Crypto-Arbitrage" -ForegroundColor Green
Write-Host ""

# Vérifier si Git est installé
try {
    $gitVersion = git --version
    Write-Host "✅ Git détecté : $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé !" -ForegroundColor Red
    Write-Host "📥 Installez Git depuis : https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "🔄 Redémarrez ce script après installation" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 Configuration du repository..." -ForegroundColor Cyan

# Initialiser Git si nécessaire
if (-not (Test-Path ".git")) {
    Write-Host "🔧 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
}

# Ajouter le remote
Write-Host "🔗 Ajout du remote GitHub..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/mathieugscsolicitors/arbitrage-cryptocom.git

# Ajouter tous les fichiers
Write-Host "📁 Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
$commitMessage = "Initial commit: Crypto-Arbitrage application - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage

# Push
Write-Host "🚀 Poussée vers GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
Write-Host "🌐 Vérifiez votre repository : https://github.com/mathieugscsolicitors/arbitrage-cryptocom" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Yellow
Write-Host "1. Vérifiez que tous les fichiers sont présents sur GitHub" -ForegroundColor White
Write-Host "2. Déployez sur Netlify depuis GitHub" -ForegroundColor White
Write-Host "3. Testez l'application avec les comptes de test" -ForegroundColor White
