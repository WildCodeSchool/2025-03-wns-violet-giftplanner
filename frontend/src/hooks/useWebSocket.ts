import { useEffect, useRef, useState } from "react";

type WSMessage =
  | { type: "JOIN_ROOM"; roomId: number }
  | { type: "LEAVE_ROOM" }
  | { type: "SEND_MESSAGE"; roomId: number; content: string };

export function useWebSocket(wsToken: string | null) {
  const [isReady, setIsReady] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!wsToken) return;

    const ws = new WebSocket(`wss://${import.meta.env.VITE_API_MESSAGE}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsReady(true);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setIsReady(false);
      // auto-reconnect
      setTimeout(() => window.location.reload(), 1500);
    };

    ws.onerror = (err) => {
      console.error("WS Error:", err);
      ws.close();
    };

    return () => ws.close();
  }, [wsToken]);

  function send(data: WSMessage) {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }

  return { send, isReady, ws: wsRef.current };
}
