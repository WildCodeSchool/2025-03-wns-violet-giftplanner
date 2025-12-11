import { useEffect } from "react";
import type { GetAllMessageMyGroupsQuery } from "../generated/graphql-types";
import type { MessageType } from "../types/Groups";
import { useLive } from "./useWebSocket";

type message = GetAllMessageMyGroupsQuery["getAllMessageMyGroups"][number]["messages"][number];

export function useLiveChat(setMessages: React.Dispatch<React.SetStateAction<MessageType>>) {
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

        const handler = (response: {
            newMessage: message,
            groupId: number
        }) => {
            setMessages(prev => {
                const clone = structuredClone(prev);
                clone[response.groupId]?.unshift(response.newMessage);
                return clone;
            });
        };

        socket.on("room-new-message", handler);

        return () => {
            socket.off("room-new-message", handler);
        };
    }, [socket]);


    return { connectToRoom, sendMessage };
}
