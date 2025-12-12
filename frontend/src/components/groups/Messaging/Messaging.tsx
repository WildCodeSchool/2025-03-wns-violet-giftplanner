import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { type useGetAllMyGroupsQuery, useSendMessageMutation } from "../../../generated/graphql-types";
import { countdownDate } from "../../../utils/dateCalculator";
import { useMyProfileStore } from "../../../zustand/myProfileStore";
import Button from "../../utils/Button";
import Icon from "../../utils/Icon";
import Title from "../../utils/Title";
import Message from "./Message";

type MessagingProps = {
  title: string;
  participants: number;
  date: Date;
  groupId: number;
  messages: NonNullable<
    NonNullable<ReturnType<typeof useGetAllMyGroupsQuery>["data"]>["getAllMyGroups"]
  >[0]["messages"];
};

export default function Messaging({ title, participants, date, groupId, messages }: MessagingProps) {
  const [sendMessage] = useSendMessageMutation();
  const [messageInput, setMessageInput] = useState<string>("");
  const { userProfile } = useMyProfileStore();

  // scroll automatique le plus en bas possible
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const didInitialScroll = useRef<null | number>(null);

  useEffect(() => {
    if (didInitialScroll.current != groupId && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      didInitialScroll.current = groupId;
    }
  }, [messages]);

  const daysLeft = countdownDate(date);
  const expired = daysLeft < 0;

  const handleSendMessage = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (messageInput.trim() === "") return;
    try {
      await sendMessage({
        variables: {
          data: {
            groupId: groupId,
            message: messageInput,
          },
        },
      });
      setMessageInput("");
    } catch (error) {
      console.error("Erreur pendant l'envoie du message", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  console.info("messages", messages);
  return (
    <div className="rounded-2xl w-full h-full border-grey border-2 border-lg flex flex-col ">
      <div className="relative w-full h-2/12 bg-blue rounded-t-2xl flex-row flex justify-center items-center py-4">
        <div className="flex flex-col w-full items-center">
          <Title>{title}</Title>
          <p className="text-white text-xs sm:text-sm place-self-center">
            <span>
              {expired
                ? `Ce groupe a expiré depuis ${Math.abs(daysLeft)} jour(s)`
                : `${daysLeft} jour(s) restant(s)`}{" "}
            </span>{" "}
            -{" "}
            <span>
              {" "}
              {participants} {participants === 1 ? "participant" : "participants"}{" "}
            </span>
          </p>
        </div>
        <div className="absolute right-0 px-8">
          <Icon icon="dots" className="text-white" />
        </div>
      </div>
      <div className="w-full px-4 overflow-auto">
        {messages
          ?.slice()
          .reverse()
          .map((message) => {
            return (
              <Message
                key={message.id}
                text={message.content}
                imageUrl={message.user.image_url ? message.user.image_url : ""}
                align={message.user.id === userProfile?.id ? "right" : "left"}
              />
            );
          })}
        <div ref={bottomRef} />
      </div>
      <div className="">
        {" "}
        {/* TODO: fix to bottom */}
        <form onSubmit={handleSendMessage} className="flex flex-row justify-around p-4">
          <textarea
            placeholder="Ecrire un message..."
            className="w-11/12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue"
            value={messageInput as string}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button colour="dark" icon="arrow" rounded type="submit" />
        </form>
      </div>
    </div>
  );
}
