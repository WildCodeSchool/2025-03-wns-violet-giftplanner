import cors from "cors";
import express from "express";
import type { ErrorRequestHandler } from "express";
import router from "./router";

const app = express();

app.use(express.json());

if (process.env.BACKEND_URL && process.env.CLIENT_URL) {
    app.use(
        cors({
            origin: [process.env.BACKEND_URL, process.env.CLIENT_URL],
        }),
    );
} else {
    console.error("Démarrage refusé: variables d'environnement cors manquantes (BACKEND_URL ou/et CLIENT_URL)");
    process.exit(1);
}

// utilisation du routeur
app.use(router);

// Middleware pour les eurreur
const logErrors: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    console.error("on req:", req.method, req.path);
    next(err);
};

//logErrors middleware globale
app.use(logErrors);

export default app;
