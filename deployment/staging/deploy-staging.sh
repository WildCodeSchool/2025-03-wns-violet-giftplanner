#!/bin/bash
# chmod +x deploy_gif-chat_staging.sh

# Si le script crash on s'arrête
set -e

mkdir -p log

# Fonction pour logger avec timestamp
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> log/deploy_staging.log
}


log "script lancé"

# Verifie existence du fichier .env.staging
if [ ! -f .env.staging ]; then
  log "Erreur: fichier .env.staging introuvable !"
  exit 1
fi

log "pull des dernières images"
docker compose --env-file .env.staging -f compose.staging.yaml pull

log "Arrêt et suppression des conteneurs existants"
docker compose --env-file .env.staging -f compose.staging.yaml down

log "Démarrage des nouveaux conteneurs"
docker compose --env-file .env.staging -f compose.staging.yaml up -d --remove-orphans

log "Déploiement terminé avec succès ! 🚀✨"