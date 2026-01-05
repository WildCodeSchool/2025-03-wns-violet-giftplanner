import express from "express";
import { io } from "./io";

const router = express.Router();

router.post("/service/message/emit", (req, res) => {
    const { text } = req.body;

    // Émettre à tous les sockets
    io.emit("new-message", text);

    return res.json({ status: "ok", emitted: text });
});

router.get("/service/message/", (req, res) => {

    return res.json("welcome to message service");
});

router.get("/service/message/hey", (req, res) => {

    return res.json({ status: "ok", emitted: "coucou ca marche" });
});

export default router;
