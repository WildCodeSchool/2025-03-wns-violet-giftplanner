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
    console.info("Client connecté :", socket.id);

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
        } catch (error) {
            console.info("Erreur lors de la vérification du token de groupe :", error);
            return;
        }
    });

    socket.on("send-room-message", async ({ roomId, newMessage }: { roomId: number, newMessage: string }) => {
        try {
            const cookies = parse(socket.request.headers.cookie || "");
            const token = cookies.token;

            if (!token) return;

            // envoie le message au backend pour le sauvegarder
            try {
                const mutation = `
                mutation SendMessage($data: NewMessageInput!) {
                    sendMessage(data: $data) {
                        id
                        content
                        createdAt
                        updatedAt
                        isEdited
                        user {
                            id
                            firstName
                            lastName
                            image_url
                            isAdmin
                        }
                    }
                }
                `;

                const variable = {
                    data: {
                        groupId: Number(roomId),
                        message: newMessage,
                        secretServeur: process.env.INTERNAL_SECRET_KEY,
                        userToken: token,
                    }
                };

                const response = await axios.post(
                    "http://backend:3310/graphql",
                    { query: mutation, variables: variable },
                    { headers: { "Content-Type": "application/json" } }
                );

                // renvoie le message à tous les membres de la room
                io.to(`group-${roomId}`).emit("room-new-message", {
                    newMessage: response.data.data.sendMessage,
                    groupId: roomId
                });
            } catch (error: any) {
                console.error("Erreur de graphQL :", error.response?.data);
            }

        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    });

    socket.on("disconnect", () => {
        console.info("Client déconnecté :", socket.id);
    });
});

export { httpServer, io };