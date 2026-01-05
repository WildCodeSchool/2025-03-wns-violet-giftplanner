import { useEffect } from "react";
import type { GetAllMessageMyGroupsQuery } from "../generated/graphql-types";
import { useLive } from "./useWebSocket";

type message = GetAllMessageMyGroupsQuery["getAllMessageMyGroups"][number]["messages"][number];

export function useLiveChat(setMessages: (response: { newMessage: message, groupId: number }) => void) {
    const socket = useLive();

    function connectToRoom(token: string | undefined) {
        socket?.emit("join-groups", { groupsToken: token });
    }

    function sendMessage(groupId: number, message: string) {
        socket?.emit("send-room-message", {
            roomId: String(groupId),
            newMessage: message,
        });
    }

    useEffect(() => {
        if (!socket) return;

        socket.on("room-new-message", setMessages);

        return () => {
            socket.off("room-new-message", setMessages);
        };
    }, [socket]);


    return { connectToRoom, sendMessage };
}
