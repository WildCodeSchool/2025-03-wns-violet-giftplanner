import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { ExtWebSocket } from "./types/ws";

dotenv.config();

const wss = new WebSocketServer({ port: 4001 });

// Structure interne : Map<roomId, Set<WebSocket>>
const rooms = new Map<string, Set<any>>();

wss.on("connection", (ws: ExtWebSocket, req) => {
    const params = new URLSearchParams(req.url?.split("?")[1]);
    // const token = params.get("token");

    // try {
    //     const payload = jwt.verify(token, process.env.WS_SECRET!);
    //     ws.user = payload; // stocker les infos user
    // } catch (e) {
    //     ws.close();
    //     return;
    // }

    ws.send(JSON.stringify({ type: "CONNECTED" }));


    ws.on("message", async (raw) => {
        const msg = JSON.parse(raw.toString());

        if (msg.type === "JOIN_ROOM") {
            const roomId = msg.roomId;

            if (!rooms.has(roomId)) {
                rooms.set(roomId, new Set());
            }

            rooms.get(roomId)!.add(ws);
            ws.currentRoom = roomId;

            ws.send(JSON.stringify({
                type: "ROOM_JOINED",
                roomId
            }));
        }
        if (msg.type === "CREATE_ROOM") {
            const roomId = msg.roomId;

            if (!rooms.has(roomId)) {
                rooms.set(roomId, new Set());
            }

            ws.send(JSON.stringify({
                type: "ROOM_CREATED",
                roomId
            }));
        }



        if (msg.type === "SEND_MESSAGE") {
            const { roomId, content } = msg;

            // 1. PROTECTION — vérifier que l’utilisateur appartient bien à la room
            if (ws.currentRoom !== roomId) return;

            // 2. Appel à GraphQL pour enregistrer le message
            // const savedMessage = await saveMessageToGraphQL({
            //     roomId,
            //     userId: ws.user.id,
            //     content,
            // });

            // 3. Broadcast uniquement aux clients connectés dans cette room
            const clients = rooms.get(roomId);
            if (clients) {
                clients.forEach((client) => {
                    client.send(JSON.stringify({
                        type: "NEW_MESSAGE",
                        roomId,
                        message: savedMessage
                    }));
                });
            }
        }


        if (msg.type === "LEAVE_ROOM") {
            const roomId = ws.currentRoom;
            if (!roomId) return;

            if (rooms.has(roomId)) {
                rooms.get(roomId)!.delete(ws);

                if (rooms.get(roomId)!.size === 0) {
                    rooms.delete(roomId);
                }
            }

            ws.currentRoom = undefined;
        }

    });
});