# Guid utilisation de biome & husky
## Installation de biome
il faut a la racine du projet installer tout les dépendances du pakage.json de la racine du projet
```bash
npm install
```
## Commande utile
Pour lancer biome en mode check
```bash
npm run lint
```
ce qui fait appel a la commande : `biome check .`  
Pour que biome corige automatiquement les erreurs qu'il peut corriger
```bash
npm run lint-fix
```
ce qui fait appel a la commande : `biome check --write .`

## Restition husky
husky va faire appel a biome a chaque commit pour vérifier le code, pas de panique si il a beaucoup d'erreur, il suffit de lancer la commande `npm run lint-fix` pour que biome corrige automatiquement les erreurs qu'il peut corriger.  
Apres avoir lancer la commande il restera peut voir plus eurreur a corriger, il faudra les corriger manuellement.  
**Ne pas désactiver de commande ou bypass husky** sauf si vous êtes **vraiment** obligé.

## Contourner husky
Si vous êtes vraiment obligé de bypass husky, vous pouvez utiliser la commande suivante :
```bash
git commit --no-verify -m "votre message de commit"
```
En sachant que ca va foirer les tests qui aura lors du merge avec la dev.