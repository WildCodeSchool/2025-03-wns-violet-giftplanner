import express from "express";
import notification from "./modules/notification";
import health from "./modules/healcheck";

const router = express.Router();

router.get("/hey", (_req, res) => {
    res.send("Hello World!");
});

router.post('/notify', notification.notify);

router.get('/health', health.health);

export default router;
