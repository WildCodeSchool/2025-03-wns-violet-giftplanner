import { useEffect, useState } from "react";
import Groups from "../components/Groups/Groups";
import Messaging from "../components/Groups/Messaging/Messaging";
// import PiggyBank from "../components/Groups/PiggyBank";
// import Wishlist from "../components/Groups/Wishlist";
import Button from "../components/utils/Button";
import type { GetAllMyGroupsQuery } from "../generated/graphql-types";
import { useGetAllMyGroupsQuery, useGetAllMessageMyGroupsQuery } from "../generated/graphql-types";
import { useLiveChat } from "../hooks/useChat";
import type { MessageType } from "../types/Groups";

export default function Conversations() {
  const [_whislist, setWishlist] = useState(true);

  const { data: groupData, refetch: refetchGroups } = useGetAllMyGroupsQuery({ fetchPolicy: "no-cache", nextFetchPolicy: "no-cache" });
  const { data: messageData, refetch: refetchMessage } = useGetAllMessageMyGroupsQuery({ fetchPolicy: "no-cache", nextFetchPolicy: "no-cache" });
  const [groups, setGroups] = useState<GetAllMyGroupsQuery["getAllMyGroups"]["groups"]>([]);
  const [messages, setMessages] = useState<MessageType>({});

  const [indexGroups, setIndexGroup] = useState<number>(-1);

  const chat = useLiveChat(setMessages);

  function calbackSetActiveGroupId(id: Number) {
    setIndexGroup(groups.findIndex((g) => Number(g.id) === Number(id)));
  }

  // useEffect(() => {
  //   refetchMessage();
  //   refetchGroups();
  // }, []);

  // pour set les groups
  useEffect(() => {
    setGroups(groupData?.getAllMyGroups.groups || []);

    // demande au server de rejoindre les rooms que utilisateur possède
    chat.connectToRoom(groupData?.getAllMyGroups.groupToken)
  }, [groupData, chat]);

  // pour set les messages
  useEffect(() => {
    const data = messageData?.getAllMessageMyGroups;
    const messagesMap: MessageType = {};
    data?.forEach((groupMessages) => {
      messagesMap[Number(groupMessages.groupId)] = groupMessages.messages;
    });

    setMessages(messagesMap);
  }, [messageData]);

  //TO DO: set activeGroup.id in url

  return (
    <div className="flex flex-row h-full justify-around w-full relative ">
      {/* Left Column */}
      <div className="flex flex-col mx-[2vw] h-full min-h-0 justify-between">
        <div className="h-[calc(50%-2rem)] flex pb-2 ">
          {groups && <Groups groups={groups} calbackSetActiveGroupId={calbackSetActiveGroupId} />}
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
      <div className="flex flex-1 w-1/2 h-full  mt-0 justify-center">
        {indexGroups !== -1 && groups.length > 0 && (
          <Messaging
            title={groups[indexGroups].name}
            participants={2}
            date={new Date(groups[indexGroups].deadline)}
            groupId={Number(groups[indexGroups].id)}
            messages={messages[Number(groups[indexGroups].id)]}
            calbackSendMessage={chat.sendMessage}
          />
        )}
      </div>
    </div>
  );
}
