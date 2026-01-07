# 📚 Documentation des commandes Makefile

`help` : Affiche la liste des commandes disponibles.

`dev` : Lance docker en mode développement.

`stop-all` : Stoppe tous les conteneurs en cours d'exécution.

`clean` : Supprime tous les conteneurs, images, volumes et réseaux inutilisés.

`d-liste` : Donne des informations sur les conteneurs en cours d'exécution.

`d-liste-all` : Donne des informations sur tous les conteneurs (meme ceux pas en cours d'exécution).

`d-log-all` : Affiche les logs de tous les conteneurs.

`d-start` : Démarre un conteneur spécifique.  
-> Affiche la liste des conteneurs disponibles  
-> Demande le nom du conteneur à démarrer  

`d-stop` : Stoppe un conteneur spécifique.  
-> Affiche la liste des conteneurs en cours d'exécution  
-> Demande le nom du conteneur à stopper  

`d-log` : Affiche les logs d'un conteneur spécifique.  
-> Affiche la liste des conteneurs disponibles  
-> Demande le nom du conteneur dont on veut voir les logs  
-> Option -f pour rester focus sur les logs du conteneur  

`d-bash` : Ouvre un terminal bash dans un conteneur spécifique.  
-> Affiche la liste des conteneurs en cours d'exécution
-> Demande le nom du conteneur dans lequel on veut ouvrir un terminal bash