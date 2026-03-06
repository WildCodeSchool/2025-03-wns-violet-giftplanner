import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const tokenServeurVerify: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const { tokenService } = req.body;

    // si il a pas de token dans la request
    if (!tokenService) {
      return res.status(401).json({ message: "Token de service manquant" });
    }

    // si on a pas configurée la variable d'environnement dans le serveur
    const INTERNAL_SECRET_KEY = process.env.INTERNAL_SECRET_KEY;
    if (!INTERNAL_SECRET_KEY) {
      console.warn("INTERNAL_SECRET_KEY n'est pas défini dans les variables d'environnement");
      return res.status(500).json({ message: "Eurreur interne est survenu" });
    }

    // test le token et verifie sont autentification
    try {
      const decoded = jwt.verify(tokenService, INTERNAL_SECRET_KEY);
      // si il a un truc qui va pas on refuse l'acces
      if (typeof decoded === "string" || !decoded.service || decoded.service !== "API-graphQL") {
        return res.status(403).json({ message: "Token de service invalide" });
      }
    } catch (err) {
      return res.status(403).json({ message: "Token de service invalide" });
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default {
  tokenServeurVerify
};