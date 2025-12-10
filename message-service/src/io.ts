import "dotenv/config";
import { createServer } from "http";
import app from "./app";
import { Server } from "socket.io";

// crée le serveur HTTP depuis l'app Express
const httpServer = createServer(app);

// crée le serveur socket.io
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
    path: "/service/message/socket.io",
});

io.on("connection", (socket) => {
    console.log("Client connecté :", socket.id);
    socket.emit("messageTeste", "coucou le web marche !");

    // Réception d'un message recu via Socket.IO
    socket.on("send-message", (message) => {
        console.log("Message reçu :", message);

        // Réémettre à tous les clients
        io.emit("new-message", message);
    });

    socket.on("disconnect", () => {
        console.log("Client déconnecté :", socket.id);
    });
});

export { httpServer, io };