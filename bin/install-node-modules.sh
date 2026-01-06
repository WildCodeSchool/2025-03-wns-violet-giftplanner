#!/bin/bash
ROOT_DIR=$(pwd)

echo "📦 Installation des dépendances du projet..."

dossier=("backend" "frontend" "message-service" "picture-service")

# Installer les dépendances à la racine
if [ -f "package.json" ]; then
    npm install --silent
    echo "    - ✅ Dépendances de la racine installées"
else
    echo "    - ⚠️  Aucun package.json trouvé la racine"
fi

# Installer les dépendances dans chaque dossier spécifié du projet
for d in "${dossier[@]}";
do
    cd "$ROOT_DIR/$d"
    if [ -f "package.json" ]; then
        npm install --silent
        echo "    - ✅ Dépendances du $d installées"
    else
        echo "    - ⚠️  Aucun package.json trouvé dans le $d"
    fi
done

# message de fin
if [ "$1" != "no-finish" ]; then
    echo "🎉 Toutes les dépendances du projet ont été installées avec succès."
fi