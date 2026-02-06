import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

export function useLive() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_MESSAGE_SOCKET_URL, {
      path: "/service/message/socket.io",
      transports: ["websocket"],
    });

    // l'événement de connexion
    socket.on("connect", () => {
      /*       console.log("Connecté :", socket.id); */
    });

    setSocket(socket);

    return () => {
      /*       console.log("Client déconncté"); */
      socket.disconnect();
    };
  }, []);

  return socket;
}
