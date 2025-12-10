import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

export function useLiveMessages() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      path: "/service/message/socket.io",
      transports: ["websocket"],
    });

    // l'événement de connexion
    socket.on("connect", () => {
      console.log("Connecté :", socket.id);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
}
