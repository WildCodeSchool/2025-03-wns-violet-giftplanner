import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";


export function useLiveMessages() {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socket = io("http://localhost:3000", { path: "/service/message/socket.io", transports: ["websocket"] });

        console.log("Aactivation du WebSocket");
        // l'événement de connexion
        socket.on("connect", () => {
            console.log("Connecté :", socket.id);
        });

        // socket.on("new-message", (msg) => {
        //     console.log("Message :", msg);
        // });

        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, []);

    return socket;
}
