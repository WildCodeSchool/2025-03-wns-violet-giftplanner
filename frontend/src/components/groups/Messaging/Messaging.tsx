import type { FormEvent, KeyboardEvent, RefObject, UIEvent } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FaArrowDown, FaLocationArrow } from "react-icons/fa";
import type { GetAllMessageMyGroupsQuery } from "../../../graphql/generated/graphql-types.ts";
import { useGetLazyMessagesLazyQuery } from "../../../graphql/generated/graphql-types.ts";
import type { Message as MessageType } from "../../../types/Message";
import { countdownDate, isSameDate } from "../../../utils/dateCalculator.ts";
import { useMyProfileStore } from "../../../zustand/myProfileStore.ts";
import Icon from "../../utils/Icon.tsx";
import Subtitle from "../../utils/Subtitle.tsx";
import Message from "./Message.tsx";
import TimeLigne from "./TimeLigne.tsx";

type MessagingProps = {
  title: string;
  participants: number;
  date: Date;
  groupId: number;
  messages: GetAllMessageMyGroupsQuery["getAllMessageMyGroups"][number]["messages"];
  addMessages: (message: GetAllMessageMyGroupsQuery["getAllMessageMyGroups"][number]["messages"]) => void;
  calbackSendMessage: (groupId: number, message: string) => void;
  contenairMessageRef: RefObject<HTMLDivElement | null>;
  updateLastVu: (groupId: number, date: Date | string, serveurSyconization?: boolean) => void;
  getLastVu: (groupId: number) => Date | undefined;
  getNbNewMessages: (groupId: number, messages: MessageType[]) => number;
};

export default function Messaging({
  title,
  participants,
  date,
  groupId,
  messages,
  addMessages,
  calbackSendMessage,
  contenairMessageRef,
  updateLastVu,
  getLastVu,
  getNbNewMessages,
}: MessagingProps) {
  const id = useId();
  const [messageInput, setMessageInput] = useState<string>("");
  const { userProfile } = useMyProfileStore();

  // scroll automatique le plus en bas possible
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const didInitialScroll = useRef<null | number>(null);
  const [oldMessagesPending, setOldMessagesPending] = useState<boolean>(false);
  const [isMaximumMessages, setIsMaximumMessages] = useState<boolean>(false);
  const [getLazyMessagesLazyQuery] = useGetLazyMessagesLazyQuery();

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

      contenairMessageRef.current?.scrollTo(0, contenairMessageRef.current.scrollHeight);
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

  const loadMoreMessage = async () => {
    if (oldMessagesPending || isMaximumMessages) return;

    // mettre en mode chargement
    setOldMessagesPending(true);

    // charger une partie des anciens messages
    const olderMessages = await getLazyMessagesLazyQuery({
      variables: {
        data: {
          groupId: groupId,
          oldTimestamp: messages[messages.length - 1].createdAt,
        },
      },
    });

    addMessages(olderMessages.data?.getLazyMessages.messages || []);
    setOldMessagesPending(false);
    setIsMaximumMessages(olderMessages.data?.getLazyMessages.isMaximumMessages || false);
  };

  const onScrollContainerMessages = async (e: UIEvent<HTMLDivElement>) => {
    // si on a déja charger tout les message ou que des messages sont en cours de chargement on sort
    if (isMaximumMessages || oldMessagesPending) return;

    const el = e.currentTarget;

    // défini a 10% de la hauteur du contenair ou 200px minimum et 1000 au max pour charger plus de messages
    const hauteurDeDeclanchement =
      el.scrollHeight * 0.1 < 200 ? 200 : el.scrollHeight > 1000 ? 1000 : el.scrollHeight * 0.1;

    if (el.scrollTop < hauteurDeDeclanchement) {
      // charger plus de message
      await loadMoreMessage();

      // après le chargement des messages on remet le scroll a la même position qu'avant le chargement
      // el.scrollTo(0, el.scrollHeight - previousHeight + previosScrollTop);
    }
  };

  const orderedMessages = useMemo(() => {
    const sortMessages = messages.slice().reverse();

    const groupedMessages = sortMessages.reduce((acc, message) => {
      // si c'est le premier message on crée un nouveau groupe
      if (acc.length === 0) return [[message]];
      const lastGroup = acc[acc.length - 1];

      // si le user est le meme que le group précédent
      if (message.user.id === lastGroup[0].user.id) {
        // si il y a moins de 5 messages dans le groupe on ajoute le message au groupe
        if (lastGroup.length < 5) {
          // si le message a été crée a maxiume 10minutes du message précédent on ajoute le message au groupe
          const lastMessageDate = new Date(lastGroup[lastGroup.length - 1].createdAt).getTime();
          const messageDate = new Date(message.createdAt).getTime();

          if (messageDate - lastMessageDate < 10 * 60 * 1000) {
            acc[acc.length - 1] = [...lastGroup, message];
            return acc;
          }
        }
      }

      acc.push([message]);
      // ajouter un nouveau groupe si l'utilisateur est différent ou si le regroupement est plein
      return acc;
    }, [] as MessageType[][]);

    // reture du useMemo
    return groupedMessages;
  }, [messages]);

  useEffect(() => {
    const el = contenairMessageRef.current;
    if (!el) return;

    const onScroll = () => {
      if (el.scrollHeight - (el.scrollTop + el.clientHeight) <= 5) {
        const lastMsgTs = messages[0]?.createdAt ? new Date(messages[0].createdAt).getTime() : 0;
        const lastVuTs = getLastVu(groupId)?.getTime() ?? 0;

        // si le dernier message est déjà vu on sort
        if (lastMsgTs <= lastVuTs) return;

        updateLastVu(groupId, messages[0]?.createdAt);
        return;
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [messages, groupId]);

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
      <div className="h-full w-full flex flex-col pr-[6px] pb-5 pl-4">
        <div className="relative w-full overflow-hidden min-h-auto flex-grow flex-shrink basis-0 pt-[10px] pb-2.5 pl-0">
          <div
            ref={contenairMessageRef}
            className="flex flex-col w-full overflow-y-auto min-h-auto h-full pr-[10px] gap-[20px]"
            onScroll={onScrollContainerMessages}
          >
            {orderedMessages.map((message, index) => {
              return (
                <div key={message[0].id} className="flex flex-col">
                  {(index === 0 ||
                    !isSameDate(message[0].createdAt, orderedMessages[index - 1][0].createdAt)) && (
                    <TimeLigne date={message[0].createdAt} />
                  )}
                  <Message regroupement={message} userId={userProfile ? Number(userProfile.id) : 0} />
                </div>
              );
            })}
            <div ref={bottomRef} />
            {getNbNewMessages(groupId, messages) > 0 && (
              <button
                className="flex cursor-pointer gap-[5px] items-center absolute px-[10px] py-[5px] bottom-[5px] left-[50%] rounded-[100px] text-[16px] text-white bg-[var(--color-blue)] hover:bg-[#1e2366]"
                style={{ transform: "translateX(-50%)" }}
                type="button"
                onClick={() => {
                  contenairMessageRef.current?.scrollTo({
                    top: contenairMessageRef.current.scrollHeight,
                    behavior: "smooth",
                  });
                }}
              >
                {getNbNewMessages(groupId, messages)} nouveau{getNbNewMessages(groupId, messages) > 1 && "x"}{" "}
                message{getNbNewMessages(groupId, messages) > 1 && "s"}
                <FaArrowDown />
              </button>
            )}
          </div>
        </div>
        <div className="w-full flex-grow-0 flex-shrink-0 basis-auto pr-2.5">
          <form
            onSubmit={handleSendMessage}
            ref={containerTextareaRef}
            className="relative h-[47px] w-full py-[7px] pr-[45px] pb-2.5 pl-[15px] border-2 border-[#b7b7b7] rounded-[22px] focus-within:outline-none focus-within:border-blue"
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
