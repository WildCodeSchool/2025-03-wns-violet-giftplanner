# 🌱 envManager

Mini framework de gestion de variables d'environnement

## ✨ Objectif

- Avoir un accès facile aux variables d'environnement de nimporte ou dans le projets
- S'assurer que aucune variable d'environnement peut étre `undefined`
- S'assurer du type des variables (string ou number) (en ts)
- Proposer une autocomplétion et un typage avec TypeScript
- Récupérer une ou plusieurs variables d'environnement en une seule ligne de code


## 📦 Installation

**Etape 1:**  
Copier les fichiers du mini framework dans un dossier `lib/envManager/`,  
**Etape 2:**  
Crée un fichier `variableEnv.d.ts` dans le dossier `types` avec le modèle suivant *(en remplaçant les variables par celles de votre projet)* :

```ts
export type VariableEnvListeType = "DB_DATABASE" | "DB_USER" | "DB_PASSWORD" | "DB_HOST" | "GATEWAY_PORT" | "JWT_SECRET";
```

**Arborescence du projet :**

```
projet/
├── lib/
│   └── envManager/
│       ├── envManager.ts
│       └── envManager.md
└── types/
    └── variableEnv.d.ts
```

## 🛠️ Utilisation

### Récupérer une/des variables d'environnements

```ts
import { getVariableEnv, getVariableEnvMulti } from "@/lib/envManager";

// pour une seule variable en string
const PORT = getVariableEnv("PORT");

// pour une seule variable en nombre
const PORT = getVariableEnv("PORT", true);

// pour plusieurs variables en string
const { PORT, URL, JWT_SECRET } = getVariableEnvMulti(["PORT", "URL", "JWT_SECRET"]);

// pour plusieur variable mais en renomant les variables
const { PORT: port, URL: url, JWT_SECRET: jwtSecret } = getVariableEnvMulti(["PORT", "URL", "JWT_SECRET"])

// pour plusieurs variables avec un mélange de string et de nombre
const { PORT, URL, JWT_SECRET, GATEWAY_PORT } = getVariableEnvMulti([["PORT", true], "URL", "JWT_SECRET", ["GATEWAY_PORT", true]]);
const { PORT:SERVEUR_PORT, URL, JWT_SECRET, GATEWAY_PORT } = getVariableEnvMulti([["PORT", true], ["URL", false], "JWT_SECRET", ["GATEWAY_PORT", true]]);
```

En cas de variable d'environnement manquante ou `undefined`, une erreur sera levée avec dans le terminal le message suivant :  
`🚨Variable d'environnement manquante : ${variable}`  

Si une variable d'environnement est censée être un nombre et que ce n'est pas le cas, une erreur sera levée avec dans le terminal le message suivant :  
`🚨Variable d'environnement ${variable} n'est pas un nombre valide`