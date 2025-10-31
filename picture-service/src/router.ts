import express from "express";
import path from "path";
import welcome from "./modules/welcome";
import picture from "./modules/picture";

const router = express.Router();

router.get("/service/picture/", welcome.healchek)

router.post("/service/picture/uploads", picture.upload)

router.use("/service/picture/uploads", express.static(path.join(__dirname, "../public/uploads")));

export default router;
