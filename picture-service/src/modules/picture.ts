import type { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import type { requestBodyUpload } from "../types/pictureType";
import { deleteImageUtils } from "../utils/pictureManager";

const upload: RequestHandler = async (req, res, next) => {
    try {
        const { imageBase64, urlExistant } = req.body as requestBodyUpload;
        if (!imageBase64) return res.status(400).send("Aucune image fournie");

        const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
        if (!matches) return res.status(400).send("Format invalide non base64");

        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");

        const uploadDir = path.join(__dirname, "../../public/uploads/profil-user");

        // supprime l'image existante si une URL est fournie
        if (urlExistant) {
            deleteImageUtils(urlExistant);
        }

        // crée le dossier s'il n'existe pas
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filename = `${Date.now()}.png`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);

        res.json({ url: `uploads/profil-user/${filename}`, mimeType });
    } catch (err) {
        next(err);
    }
};

const deleteImage: RequestHandler = async (req, res, next) => {
    try {
        const { url } = req.body as { url: string };

        if (!url) return res.status(400).send("Aucune URL fournie");

        deleteImageUtils(url);

        res.sendStatus(200);

    } catch (err) {
        next(err);
    }
};

export default {
    upload,
    deleteImage,
};