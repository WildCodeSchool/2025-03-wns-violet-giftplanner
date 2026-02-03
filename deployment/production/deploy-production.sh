#!/bin/bash
# chmod +x deploy-production.sh

# Si le script crash on s'arrête
set -e

mkdir -p log

# Fonction pour logger avec timestamp
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> log/deploy_production.log
}


log "script lancé"

# Verifie existence du fichier .env.production
if [ ! -f .env.production ]; then
  log "Erreur: fichier .env.production introuvable !"
  exit 1
fi

log "pull des dernières images"
docker compose --env-file .env.production -f compose.production.yaml pull

log "Arrêt et suppression des conteneurs existants"
docker compose --env-file .env.production -f compose.production.yaml down

log "Démarrage des nouveaux conteneurs"
docker compose --env-file .env.production -f compose.production.yaml up -d --remove-orphans

log "Déploiement terminé avec succès ! 🚀✨"