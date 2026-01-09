import type { FormEvent, KeyboardEvent, RefObject } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import type { GetAllMessageMyGroupsQuery } from "../../../graphql/generated/graphql-types.ts";
import { countdownDate } from "../../../utils/dateCalculator.ts";
import { useMyProfileStore } from "../../../zustand/myProfileStore.ts";
import Icon from "../../utils/Icon.tsx";
import Subtitle from "../../utils/Subtitle.tsx";
import Message from "./Message";

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
  contenairMessageRef,
}: MessagingProps) {
  const id = useId();
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
  const containerTextareaRef = useRef<HTMLFormElement>(null);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (messageInput.trim() === "") return;
    try {
      await calbackSendMessage(groupId, messageInput);

      setMessageInput("");

      containerTextareaRef.current!.style.height = "47px";
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
    setMessageInput(e.target.value);

    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const nbLignesMax = 5;
    const hauteurLigne = 27;
    const padding = 17;
    containerTextareaRef.current!.style.height = `${Math.min(el.scrollHeight + 4 + padding, nbLignesMax * hauteurLigne + padding)}px`;
    el.style.height = "100%";
  };

  const orderedMessages = useMemo(() => {
    const sortMessages = messages.slice().reverse();

    return sortMessages; //.reduce((acc, message) => {
    //   return [...acc, message];
    // }, [] as typeof messages)
  }, [messages]);

  return (
    <div className="rounded-2xl w-full h-full border-grey border-2 border-lg flex flex-col">
      <div className="relative w-full h-[80px] bg-blue rounded-t-2xl flex-row flex justify-center items-center py-4">
        <div className="flex flex-col w-full items-center">
          <Subtitle>{title}</Subtitle>
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
      <div className="h-full w-full flex flex-col px-1.5 pb-5 pl-4">
        <div
          ref={contenairMessageRef}
          className="w-full overflow-y-auto flex-grow flex-shrink flex-basis-0 pt-1.5 pr-2.5 pb-2.5 pl-0"
        >
          {orderedMessages.map((message) => {
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
        <div className="w-full flex-grow-0 flex-shrink-0 flex-basis-auto pr-2.5">
          <form
            onSubmit={handleSendMessage}
            ref={containerTextareaRef}
            className="relative h-[47px] w-full py-1.5 pr-[45px] pb-2.5 pl-[15px] border-2 border-[#b7b7b7] rounded-[22px] focus-within:outline-none focus-within:border-blue"
          >
            <textarea
              ref={textareaRef}
              placeholder="Ecrire un message..."
              id={id}
              value={messageInput as string}
              onChange={handleChangeInput}
              onKeyDown={handleKeyDown}
              rows={1}
              className="w-full h-full text-lg leading-[26px] resize-none box-border overflow-y-visible focus:outline-none placeholder:text-[#b7b7b7] [&::-webkit-scrollbar]:hidden"
            />
            <button
              id={id}
              type="submit"
              title="envoyer message"
              className="absolute bottom-1 right-1.5 bg-blue rounded-full w-[35px] h-[35px] flex items-center justify-center cursor-pointer hover:bg-[#1e2366]"
            >
              <FaLocationArrow className="text-white rotate-45" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
