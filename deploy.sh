#!/bin/bash

# 🚀 Deploy manual a GitHub Pages
# Uso: ./deploy.sh "mensaje del commit"

set -e

echo "🚀 Iniciando deploy a GitHub Pages..."

# Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "master" ]]; then
    echo "⚠️  No estás en la rama main/master. Rama actual: $CURRENT_BRANCH"
    read -p "¿Continuar de todas formas? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deploy cancelado"
        exit 1
    fi
fi

# Verificar que no hay cambios sin commitear
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Hay cambios sin commitear. Agregándolos..."
    git add .
    
    # Usar mensaje personalizado o por defecto
    COMMIT_MSG=${1:-"🚀 Update Sanborns WebApp"}
    git commit -m "$COMMIT_MSG"
else
    echo "✅ No hay cambios pendientes"
fi

# Push a GitHub
echo "📤 Subiendo cambios a GitHub..."
git push origin $CURRENT_BRANCH

echo "✅ Deploy completado!"
echo "🌍 La app estará disponible en: https://[TU_USUARIO].github.io/webScrapperSbrnsHmns/"
echo "⏱️  El deploy puede tardar 1-2 minutos en aparecer"

# Abrir GitHub Actions (opcional)
read -p "¿Abrir GitHub Actions para ver el progreso? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Detectar URL del repositorio
    REPO_URL=$(git config --get remote.origin.url)
    if [[ $REPO_URL == *"github.com"* ]]; then
        # Convertir SSH/HTTPS URL a web URL
        WEB_URL=$(echo $REPO_URL | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        open "${WEB_URL}/actions" 2>/dev/null || xdg-open "${WEB_URL}/actions" 2>/dev/null || echo "Abrir manualmente: ${WEB_URL}/actions"
    fi
fi
