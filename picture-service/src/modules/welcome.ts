import type { RequestHandler } from "express";

const healchek: RequestHandler = async (_req, res, next) => {
    try {
        res.status(200).json({ message: "Coucou bienvenue dans l'api !" });
    } catch (err) {
        next(err);
    }
};

export default {
    healchek
};
