import type { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const upload: RequestHandler = async (req, res, next) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).send("Aucune image fournie");

        const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
        if (!matches) return res.status(400).send("Format invalide non base64");

        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");

        const filename = `${Date.now()}.png`;
        const filePath = path.join(__dirname, "../../public/uploads/profil-user", filename);
        fs.writeFileSync(filePath, buffer);

        res.json({ url: `uploads/profil-user/${filename}`, mimeType });
    } catch (err) {
        next(err);
    }
};

export default {
    upload
};
