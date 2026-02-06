#!/bin/bash
#chmod +x create.sh

# arrete le script avec des sécurités
set -euo pipefail

# affiche le menu de sélection d'une liste d'options passées en argument
# $1 titre, $2 options
input_select() {
  local selected=0
  local titre="$1"
  local -n OPTIONS="$2"
  local key

  draw_menu() {
    clear
    echo "$titre"
    echo

    for i in "${!OPTIONS[@]}"; do
      if [[ $i -eq $selected ]]; then
        echo -e "  🟢 \e[32m${OPTIONS[$i]}\e[0m"
      else
        echo -e "  ⚫ \e[31m${OPTIONS[$i]}\e[0m"
      fi
    done
  }

  set +e
  while true; do
    draw_menu

    # Lit une touche sans affichage
    IFS= read -rsn1 key

    # Flèches = séquence ESC + [A/[B
    if [[ $key == $'\x1b' ]]; then
      IFS= read -rsn2 key
      case "$key" in
        "[A") ((selected--)) ;; # haut
        "[B") ((selected++)) ;; # bas
      esac
    elif [[ $key == "" ]]; then
      # Entrée
      break
    fi

    # si on dépasse les bornes, on revient au début/fin
    (( selected < 0 )) && selected=$((${#OPTIONS[@]} - 1))
    (( selected >= ${#OPTIONS[@]} )) && selected=0
  done

  set -e
  menu_selected=$selected
  # option selectionnée efface le menu
  clear
  return 0
}

mapfile -t CONTAINERS < <(docker ps -a --format "{{.Names}}")
CONTAINERS+=("Tous les conteneurs")

input_select "Quelle contenaire choisir" CONTAINERS
selectedNbPages=$menu_selected
contenaire=("${CONTAINERS[$selectedNbPages]}")

# action demander
optionAction=(
  "logs -f"
  "start"
  "stop"
  "restart"
  "exec -it bash"
)
input_select "Quelle est action que vous voulez effectuer sur $contenaire" optionAction
indexSelectedAction=$menu_selected
action=("${optionAction[$indexSelectedAction]}")

# exécuter la commande docker
if [ "$contenaire" == "Tous les conteneurs" ]; then
  chemainCompose="./compose.dev.yaml"
  # log du docker compose
  if [ "$action" == "logs -f" ]; then
    docker-compose -f "$chemainCompose" logs -f
  elif [ "$action" == "start" ]; then
    docker compose --env-file .env.dev -f "$chemainCompose" up -d --build
  elif [ "$action" == "stop" ]; then
    docker compose --env-file .env.dev -f "$chemainCompose" down
  elif [ "$action" == "restart" ]; then
    docker compose --env-file .env.dev -f "$chemainCompose" down && docker compose --env-file .env.dev -f "$chemainCompose" up -d --build
  elif [ "$action" == "exec -it bash" ]; then
    echo "⚠️  Impossible d'exécuter 'exec -it bash' sur tous les conteneurs en même temps."
  else
    echo "⚠️  Action non reconnue."
  fi
else
  # log du docker compose
  if [ "$action" == "logs -f" ]; then
    docker logs -f "$contenaire"

  elif [ "$action" == "start" ]; then
    docker start "$contenaire"
    echo "✅ Le contenaire "$contenaire" a démarré."

  elif [ "$action" == "stop" ]; then
    docker stop "$contenaire"
    echo "✅ Le contenaire "$contenaire" a été arrêté."

  elif [ "$action" == "restart" ]; then
    docker restart "$contenaire"
    echo "✅ Le contenaire "$contenaire" a été redémarré."

  elif [ "$action" == "exec -it bash" ]; then
    docker exec -it "$contenaire" sh

  else
    echo "⚠️  Action non reconnue."
  fi
fi