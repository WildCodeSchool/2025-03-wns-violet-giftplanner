import { WebSocket } from "ws";

interface ExtWebSocket extends WebSocket {
    currentRoom?: string;
    user?: { id: number };
}
