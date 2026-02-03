# GiftChat

## Description
GiftChat est un site de chat en ligne qui permet de créer des groupes de discussion afin de préparer des cadeaux pour une personne lors d’un événement particulier.

## Contexte
GiftChat est un projet réalisé dans le cadre de la formation **CDA** de la **Wild Code School**, en suivant les consignes suivantes :
- Permettre aux membres d’une famille ou d’un groupe d’amis de discuter d’idées de cadeaux sans voir ce que les autres préparent pour eux.
- Un fil de discussion est consacré à chaque membre, permettant aux autres participants d’échanger des idées de cadeaux individuels ou collectifs.

## Exécution
Avoir **Docker** installé sur sa machine.  
Pour lancer le projet en local, il suffit d’exécuter, dans un terminal à la racine du projet :  
```bash
make dev-gateway
```

## Structure du projet
```
.
├── .github -> workflows GitHub
├── .husky -> hooks de pré-commit Husky
├── backend -> API principale GraphQL
├── bin -> scripts d’automatisation
├── deployment -> fichiers nécessaires au déploiement sur un VPS
├── frontend -> côté client (React)
├── gateway -> API Gateway (point d’entrée unique lorsque le projet tourne)
├── ignore -> fichier que vous pouvez créer pour ajouter du contenu non commité
├── message-service -> microservice de gestion des messages
├── persist -> dossier où sont stockés les volumes Docker (notamment la base de données)
├── picture-service -> microservice de gestion des images
├── .env.dev -> variables d’environnement pour le mode développement, à créer à partir de .env.dev.sample
├── .env.dev.sample -> exemple de fichier de variables d’environnement
├── .gitignore -> fichiers à ignorer par Git
├── biome.json -> configuration de Biome
├── biome.md -> documentation de Biome
├── compose.dev.yaml -> fichier Docker Compose pour le mode développement
├── makefile -> commandes Make pour automatiser des tâches
├── makefile.md -> documentation des commandes Make
├── package-lock.json -> fichier de verrouillage des dépendances npm
├── package.json -> gestion des dépendances npm
└── README.md -> ce fichier
```

## Commandes utiles 

Nous avons des commandes npm pour faciliter la gestion des dépendances npm en local (utiles pour autocompresstion des extenstions vsCode vu que le projet tourne avec docker c'est pas obligatoire de les utiliser) :  
- npm run nm:install : fait un npm install dans tous les dossiers de service du projet - npm run nm:clean : supprime les dossiers node_modules dans tous les dossiers de service du projet  
- npm run nm:reset : supprime puis réinstalle les dépendances npm dans tous les dossiers de service du projet  

***ps: nm = node modules*** 

## Equipe 
- [@Evelyne](https://github.com/sonar888) 
- [@Chloe](https://github.com/ChloeNuage) 
- [@Clement](https://github.com/clement4444) 
- [@Wolfgang](https://github.com/wktatschl) 



date de modification du README.md: 07/01/2026
