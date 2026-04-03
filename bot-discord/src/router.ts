import express from "express";
import notification from "./modules/notification";
import health from "./modules/healcheck";

const router = express.Router();

router.get("/hey", (_req, res) => {
    res.send("Hello World!");
});

router.get('/notify', notification.notify);

router.post('/health', health.health);

export default router;
