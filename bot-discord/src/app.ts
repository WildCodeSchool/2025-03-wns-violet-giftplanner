import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import type { ErrorRequestHandler } from "express";
import router from "./router";

dotenv.config();

const app = express();

app.use(express.json());

// Mount the API router under the "/api" endpoint
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
