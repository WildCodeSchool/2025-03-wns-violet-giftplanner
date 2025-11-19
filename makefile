.PHONY: dev clean

dev: ## Lance l’application en mode développement séparé
	docker compose --env-file .env.dev -f compose.dev.yaml up -d --build

dev-stop: ## arrete prorement
	docker compose --env-file .env.dev -f compose.dev.yaml down

stop-all: ##Stoppe tous les conteneurs en cours d'exécution
	docker stop $$(docker ps -q)

clean: ## Supprime tous les conteneurs, images, volumes et réseaux inutilisés
	docker system prune -af --volumes

d-liste: ## Liste les conteneurs Docker en cours d'exécution
	docker ps

d-liste-all: ## Liste tous les conteneurs Docker
	docker ps -a

d-log-all: ## Affiche les logs de tous les conteneurs
	docker-compose -f compose.dev.yaml logs -f

d-start: ## Démarre un conteneur spécifique
	@bash -c '\
	containers=$$(docker ps -a --format "{{.Names}}"); \
	echo "Conteneurs disponibles :"; \
	echo "$$containers"; \
	echo; \
	read -e -p "Nom du conteneur : " container; \
	if [ -n "$$container" ]; then \
		docker start "$$container"; \
	else \
		echo "❌ Aucun conteneur choisi"; \
	fi'

d-stop: ## Stoppe un conteneur spécifique
	@bash -c '\
	containers=$$(docker ps --format "{{.Names}}"); \
	echo "Conteneurs disponibles :"; \
	echo "$$containers"; \
	echo; \
	read -e -p "Nom du conteneur : " container; \
	if [ -n "$$container" ]; then \
		docker stop "$$container"; \
	else \
		echo "❌ Aucun conteneur choisi"; \
	fi'

d-log: ## Affiche les logs d'un conteneur spécifique
	@bash -c '\
	containers=$$(docker ps --format "{{.Names}}"); \
	echo "Conteneurs disponibles :"; \
	echo "$$containers"; \
	echo; \
	read -e -p "Nom du conteneur ( -f pour follow): " container; \
	arr_container=($$container); \
	if [ -n "$${arr_container[0]}" ]; then \
		if [[ "$${arr_container[1]}" == "-f" ]]; then \
			docker logs -f "$${arr_container[0]}"; \
		else \
			docker logs "$${arr_container[0]}"; \
		fi; \
	else \
		echo "❌ Aucun conteneur choisi"; \
	fi'
	
d-bash: ## Ouvre un terminal bash dans un conteneur spécifique
	@bash -c '\
	containers=$$(docker ps --format "{{.Names}}"); \
	echo "Conteneurs disponibles :"; \
	echo "$$containers"; \
	echo; \
	read -e -p "Nom du conteneur : " container; \
	if [ -n "$$container" ]; then \
		docker exec -it "$$container" sh; \
	else \
		echo "❌ Aucun conteneur choisi"; \
	fi'

help: ## Affiche la liste des commandes disponibles
	@grep -E '^[a-zA-Z0-9._-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'