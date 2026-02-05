import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Groups from "../components/groups/Groups";
import Messaging from "../components/groups/Messaging/Messaging";
import PiggyBank from "../components/groups/PiggyBank";
import Wishlist from "../components/groups/Wishlist";
import Button from "../components/utils/Button";
import type { GetAllMessageMyGroupsQuery, GetAllMyGroupsQuery } from "../graphql/generated/graphql-types";
import { useGetAllMessageMyGroupsQuery, useGetAllMyGroupsQuery } from "../graphql/generated/graphql-types";
import { useLiveChat } from "../hooks/useChat";
import type { MessageType } from "../types/Groups";

type message = GetAllMessageMyGroupsQuery["getAllMessageMyGroups"][number]["messages"][number];

export default function Conversations() {
  const [wishlist, setWishlist] = useState<boolean>(true);
  const { data: groupData } = useGetAllMyGroupsQuery({
    fetchPolicy: "cache-and-network",
  });
  const { data: messageData } = useGetAllMessageMyGroupsQuery({
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
  });
  // const { data: wishlistData } = useGroupWishlistItemsQuery({ variables: { groupId: Number(groups[indexGroups].id) } }  || skip);
  const [groups, setGroups] = useState<GetAllMyGroupsQuery["getAllMyGroups"]["groups"]>([]);
  const [messages, setMessages] = useState<MessageType>({});

  const [indexGroups, setIndexGroup] = useState<number>(0);
  const [_selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const contenairMessageRef = useRef<HTMLDivElement | null>(null);

  const handlerNewMessage = (response: { newMessage: message; groupId: number }) => {
    setMessages((prev) => {
      const clone = structuredClone(prev);
      if (!clone[response.groupId]) {
        clone[response.groupId] = [];
      }
      clone[response.groupId]?.unshift(response.newMessage);
      return clone;
    });
  };

  // scrolle vers le bas quand le rerendu est fait
  useLayoutEffect(() => {
    contenairMessageRef.current?.scrollTo(0, contenairMessageRef.current.scrollHeight);
  }, [messages]);

  const chat = useLiveChat(handlerNewMessage);

  function setActiveGroup(group: GetAllMyGroupsQuery["getAllMyGroups"]["groups"][number]) {
    const groupIndex = groups.findIndex((g) => Number(g.id) === Number(group.id));
    setIndexGroup(groupIndex);
    setSelectedGroupId(Number(group.id));
  }

  // pour set les groups
  useEffect(() => {
    const token = groupData?.getAllMyGroups.groupToken;
    if (token) {
      chat.connectToRoom(token);
    }
  }, [groupData?.getAllMyGroups.groupToken]);

  useEffect(() => {
    // waiting for data to load
    if (!groupData?.getAllMyGroups) return;

    if (groupData?.getAllMyGroups.groups.length === 0) {
      setIndexGroup(-1);
      setSelectedGroupId(null);
      return;
    }

    const newGroups = groupData?.getAllMyGroups.groups || [];
    setGroups(newGroups);

    // Initialize messages map with empty arrays for all groups
    setMessages((prev) => {
      const updated = { ...prev };
      newGroups.forEach((group) => {
        const groupId = Number(group.id);
        if (!updated[groupId]) {
          updated[groupId] = [];
        }
      });
      return updated;
    });

    //keep active group in sync or default to first during refetch
    setSelectedGroupId((currentSelectedId) => {
      if (currentSelectedId !== null) {
        const existingIndex = newGroups.findIndex((group) => Number(group.id) === currentSelectedId);
        if (existingIndex !== -1) {
          setIndexGroup(existingIndex);
          return currentSelectedId;
        }
      }
      // Default to first group
      const firstGroupId = newGroups[0] ? Number(newGroups[0].id) : null;
      setIndexGroup(firstGroupId !== null ? 0 : -1);
      return firstGroupId;
    });
  }, [groupData]);

  // pour set les messages
  useEffect(() => {
    const data = messageData?.getAllMessageMyGroups;
    const messagesMap: MessageType = {};
    data?.forEach((groupMessages) => {
      messagesMap[Number(groupMessages.groupId)] = groupMessages.messages;
    });

    // Merge with existing messages to preserve empty arrays for groups without messages
    setMessages((prev) => {
      const merged = { ...prev };
      Object.keys(messagesMap).forEach((groupId) => {
        merged[Number(groupId)] = messagesMap[Number(groupId)];
      });
      return merged;
    });
  }, [messageData]);

  //TO DO: set activeGroup.id in url

  const myGroups = groupData?.getAllMyGroups;

  return (
    <div className="flex flex-row h-full justify-around w-full relative ">
      {/* Left Column */}
      <div className="flex flex-col mx-[2vw] h-full min-h-0 justify-between">
        <div className="h-[calc(50%-2rem)] flex pb-2 ">
          {myGroups && (
            <Groups groups={myGroups} setActiveGroup={setActiveGroup} loading={false} error={undefined} />
          )}
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

        <div className="h-[calc(50%-2rem)] flex pt-2">
          {indexGroups !== -1 &&
            indexGroups < groups.length &&
            (wishlist ? (
              <Wishlist beneficiaryItems={[]} groupItems={[]} onAddIdea={() => {}} />
            ) : (
              <PiggyBank pot={groups[indexGroups].piggy_bank} />
            ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-1 w-1/2 h-full  mt-0 justify-center">
        {indexGroups !== -1 &&
          groups.length > 0 &&
          indexGroups < groups.length &&
          messages[Number(groups[indexGroups].id)] !== undefined && (
            <Messaging
              title={groups[indexGroups].name}
              participants={groups[indexGroups].groupMember.length}
              date={new Date(groups[indexGroups].deadline)}
              groupId={Number(groups[indexGroups].id)}
              messages={messages[Number(groups[indexGroups].id)]}
              calbackSendMessage={chat.sendMessage}
              contenairMessageRef={contenairMessageRef}
            />
          )}
      </div>
    </div>
  );
}
