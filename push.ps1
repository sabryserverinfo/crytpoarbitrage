# Script PowerShell pour pousser sur GitHub
Write-Host "🚀 Déploiement sur GitHub - Crypto-Arbitrage" -ForegroundColor Green

# Ajouter le remote
Write-Host "🔗 Configuration du remote GitHub..." -ForegroundColor Yellow
& "C:\Program Files\Git\cmd\git.exe" remote remove origin 2>$null
& "C:\Program Files\Git\cmd\git.exe" remote add origin https://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@github.com/sabryserverinfo/crypto-com-arbitrage.git

# Ajouter tous les fichiers
Write-Host "📁 Ajout des fichiers..." -ForegroundColor Yellow
& "C:\Program Files\Git\cmd\git.exe" add .

# Commit
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
$commitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
& "C:\Program Files\Git\cmd\git.exe" commit -m $commitMessage

# Push
Write-Host "🚀 Push vers GitHub..." -ForegroundColor Yellow
& "C:\Program Files\Git\cmd\git.exe" branch -M main
& "C:\Program Files\Git\cmd\git.exe" push -u origin main

Write-Host "✅ Terminé !" -ForegroundColor Green