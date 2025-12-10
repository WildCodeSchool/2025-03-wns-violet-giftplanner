import React, { useEffect, useState } from "react";
import Groups from "../components/Groups/Groups";
import Messaging from "../components/Groups/Messaging/Messaging";
// import PiggyBank from "../components/Groups/PiggyBank";
// import Wishlist from "../components/Groups/Wishlist";
import Button from "../components/utils/Button";
import type { GetAllMyGroupsQuery } from "../generated/graphql-types";
import { useGetAllMyGroupsQuery } from "../generated/graphql-types";
import { useLiveMessages } from "../hooks/useWebSocket";

export default function Conversations() {
  // const { data: groupData, loading, error } = useGetAllMyGroupsQuery();
  const [_whislist, setWishlist] = React.useState(true);

  const { data: groupData } = useGetAllMyGroupsQuery();
  const [groups, setGroups] = useState<GetAllMyGroupsQuery["getAllMyGroups"]["groups"]>([]);

  const [activeGroupId, setActiveGroupId] = React.useState<Number | null>(null);
  const [activeGroup, setActiveGroup] = React.useState<
    GetAllMyGroupsQuery["getAllMyGroups"]["groups"][0] | null
  >(null);

  const socket = useLiveMessages();

  function sendMessage(groupId: number, message: string) {
    socket?.emit("send-room-message", {
      roomId: String(groupId),
      newMessage: message,
    });
  }

  useEffect(() => {
    if (!socket) return;

    const handler = (msg: { newMessage: string }) => {
      console.log("ok");
      console.log("Nouveau message reçu via WebSocket :", msg);
      setGroups((prevGroups) => {
        if (prevGroups.length === 0) return prevGroups;

        // On clone le tableau
        const newGroups = [...prevGroups];

        // On clone le groupe qu’on modifie
        const group = { ...newGroups[0] };

        // On clone les messages
        const newMessages = [...group.messages];

        // On clone le message concerné
        const updatedMessage = {
          ...newMessages[0],
          content: msg.newMessage,
        };

        newMessages[0] = updatedMessage;

        group.messages = newMessages;
        newGroups[0] = group;

        return newGroups;
      });
    };

    socket.on("room-new-message", handler);

    return () => {
      socket.off("room-new-message", handler);
    };
  }, [socket, groups, activeGroupId]);

  useEffect(() => {
    setGroups(groupData?.getAllMyGroups.groups || []);
    // demande au server de rejoindre les rooms que utilisateur possède
    socket?.emit("join-groups", { groupsToken: groupData?.getAllMyGroups.groupToken });
  }, [groupData]);

  useEffect(() => {
    if (activeGroupId === null) {
      setActiveGroup(null);
      return;
    }
    setActiveGroup(groups.find((g) => Number(g.id) === activeGroupId) || null);
  }, [activeGroupId, groups]);

  //TO DO: set activeGroup.id in url

  return (
    <div className="flex flex-row h-full justify-around w-full relative ">
      {/* Left Column */}
      <div className="flex flex-col mx-[2vw] h-full min-h-0 justify-between">
        <div className="h-[calc(50%-2rem)] flex pb-2 ">
          {groups && <Groups groups={groups} setActiveGroup={setActiveGroupId} />}
        </div>

        <div className="flex flex-row gap-2 pb-2 absolute top-[calc(50%)]">
          <Button
            text="Wishlist"
            icon="heart"
            colour="orange"
            onClick={() => {
              setWishlist(true);
            }}
          />
          <Button
            text="Cagnotte"
            icon="dollar"
            colour="yellow"
            onClick={() => {
              setWishlist(false);
            }}
          />
        </div>

        {/* <div className="h-[calc(50%-2rem)] flex pt-2">
          {activeGroup &&
            (whislist ? (
              <Wishlist wishlistItems={activeGroup.wishlist} />
            ) : (
              <PiggyBank pot={activeGroup.fund} />
            ))}
        </div> */}
      </div>

      {/* Right Column */}
      <div className="flex flex-1 w-1/2 h-full  mt-0 overflow-y-auto justify-center">
        {activeGroup && (
          <Messaging
            title="titre todo"
            participants={2}
            date={new Date(activeGroup.deadline)}
            groupId={Number(activeGroup.id)}
            messages={activeGroup.messages}
            calbackSendMessage={sendMessage}
          />
        )}
      </div>
    </div>
  );
}
