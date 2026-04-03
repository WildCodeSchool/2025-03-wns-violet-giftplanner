docker compose --env-file .env -f compose.bot.prod.yaml pull
docker compose --env-file .env -f compose.bot.prod.yaml up -d --remove-orphans