import "dotenv/config";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import app from "./app";
import { Server } from "socket.io";
import { parse } from "cookie";
import axios from "axios";

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

    // rejoin des rooms
    socket.on("join-groups", ({ groupsToken }: { groupsToken: string }) => {
        if (!groupsToken) return;

        try {
            // décode le token pour obtenir les IDs des groupes
            const payload = jwt.verify(groupsToken, process.env.JWT_SECRET as string) as { groupsId: number[] };

            if (!Array.isArray(payload.groupsId)) return;

            const rooms = payload.groupsId.map(id => `group-${id}`);

            // ajoute user aux rooms dont il est membre
            socket.join(rooms);
            console.log(`Client ${socket.id} a rejoint les rooms :`, rooms);
        } catch (error) {
            console.info("Erreur lors de la vérification du token de groupe :", error);
            return;
        }
    });

    socket.on("send-room-message", async ({ roomId, newMessage }: { roomId: number, newMessage: string }) => {
        try {
            console.log(`Message reçu pour la room ${roomId} : ${newMessage}`);
            // // récupère le token de l'utilisateur
            console.log("Cookies reçus :", socket.request.headers.cookie);
            const cookies = parse(socket.request.headers.cookie || "");
            // const token = cookies.token;
            // if (!token) return;
            // envoie le message au backend pour le sauvegarder
            // try {
            //     const body = {
            //         name: "Coco",
            //         email: "coco@example.com",
            //     };

            //     const response = await axios.post("https://api.example.com/users", body);

            //     console.log("Utilisateur créé :", response.data);
            // } catch (error) {
            //     console.error("Erreur API :", error);
            // }
            io.to(`group-${roomId}`).emit("room-new-message", {
                newMessage,
            });
            console.log(`Message diffusé à la room group-${roomId}`);
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("Client déconnecté :", socket.id);
    });
});

export { httpServer, io };