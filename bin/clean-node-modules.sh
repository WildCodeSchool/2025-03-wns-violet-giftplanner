#!/bin/bash
ROOT_DIR=$(pwd)

echo "🧹 Suppression de tous les node_modules..."

dossier=("backend" "frontend" "message-service" "picture-service")

# Supprimer les node_modules à la racine
if [ -d "node_modules" ]; then
  rm -rf node_modules
  echo "    - ✅ Dossier node_modules de la racine supprimé"
else
  echo "    - ⚠️  Pas de dossier de la racine node_modules"
fi


# Supprimer les node_modules dans chaque dossier spécifié du projet
for d in "${dossier[@]}";
do
  cd "$ROOT_DIR/$d"

  if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "    - ✅ Dossier node_modules du $d supprimé"
  else
    echo "    - ⚠️  Pas de dossier node_modules dans $d"
  fi
done


if [ "$1" != "no-finish" ]; then
  echo "🎉 Tous les dossiers node_modules ont été supprimés avec succès."
fi