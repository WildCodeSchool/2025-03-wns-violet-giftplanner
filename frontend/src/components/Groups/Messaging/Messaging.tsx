import type { FormEvent, KeyboardEvent, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import type { GetAllMessageMyGroupsQuery } from "../../../generated/graphql-types";
import { countdownDate } from "../../../utils/dateCalculator";
import { useMyProfileStore } from "../../../zustand/myProfileStore";
import { FaLocationArrow } from "react-icons/fa";
import Icon from "../../utils/Icon";
import Title from "../../utils/Title";
import Message from "./Message";
import "./messaging.css";

type MessagingProps = {
  title: string;
  participants: number;
  date: Date;
  groupId: number;
  messages: GetAllMessageMyGroupsQuery["getAllMessageMyGroups"][number]["messages"];
  calbackSendMessage: (groupId: number, message: string) => void;
  contenairMessageRef: RefObject<HTMLDivElement | null>;
};

export default function Messaging({
  title,
  participants,
  date,
  groupId,
  messages,
  calbackSendMessage,
  contenairMessageRef
}: MessagingProps) {
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contenaireTextareaRef = useRef<HTMLFormElement>(null);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (messageInput.trim() === "") return;
    try {
      await calbackSendMessage(groupId, messageInput);

      setMessageInput("");

      contenaireTextareaRef.current!.style.height = "47px";
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

  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value)

    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const nbLignesMax = 5;
    const hauteurLigne = 27;
    const padding = 17;
    contenaireTextareaRef.current!.style.height = Math.min(el.scrollHeight + 4 + padding, nbLignesMax * hauteurLigne + padding) + "px";

    el.style.height = "100%";
  };

  return (
    <div className="rounded-2xl w-full h-full border-grey border-2 border-lg flex flex-col">
      <div className="relative w-full h-2/12 bg-blue rounded-t-2xl flex-row flex justify-center items-center py-4">
        <div className="flex flex-col w-full items-center">
          <Title>{title}</Title>
          <p className="text-white text-xs sm:text-sm place-self-center">
            <span>
              {expired
                ? `Ce groupe a expiré depuis ${Math.abs(daysLeft)} jour(s)`
                : `${daysLeft} jour(s) restant(s)`}{" "}
            </span>{" "}
            - <span> {participants} participants </span>
          </p>
        </div>
        <div className="absolute right-0 px-8">
          <Icon icon="dots" className="text-white" />
        </div>
      </div>
      <div className="container-body-messaging">
        <div ref={contenairMessageRef} className="container-messages">
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
        <div className="container-send-message">
          <form onSubmit={handleSendMessage} ref={contenaireTextareaRef} className="formulaire-send-message">
            <textarea
              ref={textareaRef}
              placeholder="Ecrire un message..."
              id="input-send-message"
              value={messageInput as string}
              onChange={handleChangeInput}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button id="bnt-send-message" type="submit" title="envoyer message">
              <FaLocationArrow className="icon-fleche-send" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
