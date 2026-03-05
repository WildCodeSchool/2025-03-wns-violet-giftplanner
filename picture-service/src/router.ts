import express from "express";
import path from "path";
import welcome from "./modules/welcome";
import picture from "./modules/picture";
import autentification from "./modules/middlewares/autentification";

const router = express.Router();

router.get("/service/picture/", welcome.healchek);

// route protégée par le token de serveur
router.post("/service/picture/uploads", autentification.tokenServeurVerify, picture.upload);

// route protégée par le token de serveur
router.post("/service/picture/delete", autentification.tokenServeurVerify, picture.deleteImage);

router.use("/service/picture/uploads", express.static(path.join(__dirname, "../public/uploads")));

export default router;
