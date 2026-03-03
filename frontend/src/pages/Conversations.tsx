import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { LuCirclePlus, LuMessageCircleMore, LuSettings } from "react-icons/lu";
import GroupFormindex from "../components/forms/groups/index";
import AddFundsModal from "../components/groups/AddFundsModal";
import Groups from "../components/groups/Groups";
import Messaging from "../components/groups/Messaging/Messaging";
import type { MobileView } from "../components/groups/Messaging/MobileBottomButtons";
import MobileBottomButtons from "../components/groups/Messaging/MobileBottomButtons";
import PiggyBank from "../components/groups/PiggyBank";
import Wishlist from "../components/groups/Wishlist";
import Button from "../components/utils/Button";
import DropdownMenu from "../components/utils/DropdownMenu";
import Modal from "../components/utils/Modal";
import type { GetAllMessageMyGroupsQuery, GetAllMyGroupsQuery } from "../graphql/generated/graphql-types";
import {
  useGetAllMessageMyGroupsQuery,
  useGetAllMyGroupsQuery,
  useGroupWishlistItemsQuery,
} from "../graphql/generated/graphql-types";
import useVuMessage from "../hooks/message/vuMessage";
import { useLiveChat } from "../hooks/useChat";
import { useIsMobile } from "../hooks/useIsMobile";
import type { MessageType } from "../types/Groups";
import { countdownDate, formatDate } from "../utils/dateCalculator";
import { useMobileNavigationStore } from "../zustand/mobileNavigationStore";
import "./conversations.css";
import type { Message } from "../types/Message";

type MobileViewState = "groups" | "chat" | "wishlist" | "cagnotte";

export default function Conversations() {
  const isMobile = useIsMobile();
  const { setBottomNavVisible } = useMobileNavigationStore();

  const [wishlist, setWishlist] = useState<boolean>(true);
  const [mobileView, setMobileView] = useState<MobileViewState>("groups");
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const groupMenuRef = useRef<HTMLDivElement>(null);

  const { data: groupData, refetch: refetchGroups } = useGetAllMyGroupsQuery({
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
  });
  const { data: messageData } = useGetAllMessageMyGroupsQuery({
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
  });

  const [groups, setGroups] = useState<GetAllMyGroupsQuery["getAllMyGroups"]["groups"]>([]);
  const [messages, setMessages] = useState<MessageType>({});
  // const [nbNewMessagesRef, setNbNewMessagesRef] = useState<{ [groupId: number]: number }>({});
  const { updateLastVu, getNbNewMessages, getLastVu } = useVuMessage();
  const [indexGroups, setIndexGroup] = useState<number>(0);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const canQueryWishlist = indexGroups !== -1 && groups.length > 0 && !!groups[indexGroups];

  const { data: wishlistData, refetch: refetchWishlist } = useGroupWishlistItemsQuery({
    variables: { groupId: Number(groups[indexGroups]?.id) },
    skip: !canQueryWishlist,
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
  });

  const beneficiaryItems = wishlistData?.groupWishlistItems?.fromWishlist ?? [];

  const groupItems = wishlistData?.groupWishlistItems?.fromGroupList ?? [];

  const contenairMessageRef = useRef<HTMLDivElement | null>(null);

  const handlerNewMessage = (response: { newMessage: Message; groupId: number }) => {
    setMessages((prev) => {
      const clone = structuredClone(prev);
      if (!clone[response.groupId]) {
        clone[response.groupId] = [];
      }
      clone[response.groupId]?.unshift(response.newMessage);
      return clone;
    });
  };

  // scroller vers le bas quand on reçoit un nouveau message
  useEffect(() => {
    if (indexGroups === -1) return;
    if (!groups[indexGroups]) return;
    if (!Number(groups[indexGroups].id)) return;
    const groupsId = Number(groups[indexGroups].id);

    if (getNbNewMessages(groupsId, messages[groupsId]) > 0) {
      // scrolle vers le bas si on y est déjà
      if (!contenairMessageRef.current) return;
      const scrollTop = contenairMessageRef.current.scrollTop;
      const scrollHeight = contenairMessageRef.current.scrollHeight;
      const clientHeight = contenairMessageRef.current.clientHeight;

      const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceToBottom >= clientHeight) return;

      contenairMessageRef.current.scrollTo(0, scrollHeight);

      updateLastVu(groupsId, messages[groupsId][0].createdAt);
    }
  }, [messages]);

  const chat = useLiveChat(handlerNewMessage);

  function setActiveGroup(group: GetAllMyGroupsQuery["getAllMyGroups"]["groups"][number]) {
    const groupIndex = groups.findIndex((g) => Number(g.id) === Number(group.id));
    setIndexGroup(groupIndex);
    setSelectedGroupId(Number(group.id));
  }

  // Fermer le menu groupe si click en dehors
  useEffect(() => {
    if (!isGroupMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (groupMenuRef.current && !groupMenuRef.current.contains(e.target as Node)) {
        setIsGroupMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isGroupMenuOpen]);

  // Handle mobile view changes - hide/show bottom navigation
  useEffect(() => {
    if (isMobile) {
      setBottomNavVisible(mobileView === "groups");
    } else {
      setBottomNavVisible(true);
    }
  }, [isMobile, mobileView, setBottomNavVisible]);

  // Reset mobile view when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileView("groups");
    }
  }, [isMobile]);

  // pour set les groups
  useEffect(() => {
    setGroups(groupData?.getAllMyGroups.groups || []);
    chat.connectToRoom(groupData?.getAllMyGroups.groupToken);
  }, [groupData, chat]);

  // useEffect(() => {
  //   if (!groupData?.getAllMyGroups) return;

  //   if (groupData?.getAllMyGroups.groups.length === 0) {
  //     setIndexGroup(-1);
  //     setSelectedGroupId(null);
  //     return;
  //   }

  //   const newGroups = groupData?.getAllMyGroups.groups || [];
  //   setGroups(newGroups);

  //   // Initialize messages map with empty arrays for all groups
  //   setMessages((prev) => {
  //     const updated = { ...prev };
  //     newGroups.forEach((group) => {
  //       const groupId = Number(group.id);
  //       if (!updated[groupId]) {
  //         updated[groupId] = [];
  //       }
  //     });
  //     return updated;
  //   });

  //   const existing =
  //     indexGroups !== -1
  //       ? groupData?.getAllMyGroups.groups.find((group) => Number(group.id) === Number(indexGroups))
  //       : null;

  //   setIndexGroup(existing ? indexGroups : 0);
  // }, [groupData, indexGroups]);

  // pour set les messages initiaux
  useEffect(() => {
    const data = messageData?.getAllMessageMyGroups;
    const messagesMap: MessageType = {};
    data?.forEach((groupMessages) => {
      messagesMap[Number(groupMessages.groupId)] = groupMessages.messages;
    });

    setMessages(messagesMap);

    // set les nb de nouveaux messages
    data?.forEach((groupMessages) => {
      updateLastVu(Number(groupMessages.groupId), groupMessages.lastTempstampVu, false);
    });
  }, [messageData]);

  const addMessage = (groupId: number, message: Message[]) => {
    setMessages((prev) => {
      const clone = structuredClone(prev);
      if (!clone[groupId]) {
        clone[groupId] = [];
      }
      clone[groupId] = [...clone[groupId], ...message];
      return clone;
    });
  };

  const myGroups = groupData?.getAllMyGroups;

  // Mobile navigation handlers
  const handleGroupClick = (group: GetAllMyGroupsQuery["getAllMyGroups"]["groups"][number]) => {
    setActiveGroup(group);
    setSlideDirection("right");
    setIsAnimating(true);
    setMobileView("chat");
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleBackToGroups = () => {
    setSlideDirection("left");
    setIsAnimating(true);
    setTimeout(() => {
      setMobileView("groups");
      setIsAnimating(false);
    }, 300);
  };

  const handleMobileViewChange = (view: MobileView) => {
    setMobileView(view);
  };

  // Build subtitle for header
  const getHeaderSubtitle = () => {
    if (indexGroups === -1 || groups.length === 0) return undefined;
    const group = groups[indexGroups];
    const daysLeft = countdownDate(new Date(group.deadline));
    const expired = daysLeft < 0;
    const participants = group.groupMember?.length || 0;

    return `${expired ? `Expiré depuis ${Math.abs(daysLeft)} jour(s)` : `${daysLeft} jour(s) restant(s)`} - ${participants} ${participants === 1 ? "participant" : "participants"}`;
  };

  // Determine CSS classes for chat view
  const getChatViewClasses = () => {
    const classes = ["mobile-view", "mobile-chat-view"];

    if (mobileView === "groups" && !isAnimating) {
      classes.push("hidden-right");
    }
    if (isAnimating && slideDirection === "right") {
      classes.push("slide-in-right");
    }
    if (isAnimating && slideDirection === "left") {
      classes.push("slide-out-right");
    }

    return classes.join(" ");
  };

  // Mobile render
  if (isMobile) {
    return (
      <div className="mobile-view-container h-full">
        {/* Groups View - always visible underneath */}
        <div className="mobile-view mobile-groups-view">
          <div className="mobile-groups-page">
            {/* Header */}
            <div className="mobile-groups-header">
              <div className="mobile-groups-title">
                <h2>Mes groupes</h2>
              </div>
            </div>

            {/* Content */}
            <div className="mobile-groups-content">
              {groups.length === 0 ? (
                <div className="mobile-groups-empty">
                  <LuMessageCircleMore className="mobile-groups-empty-icon" />
                  <p className="mobile-groups-empty-text">Aucun groupe pour l'instant.</p>
                  <button
                    type="button"
                    onClick={() => setIsCreateGroupModalOpen(true)}
                    className="mobile-groups-empty-button"
                  >
                    <LuCirclePlus />
                    Créer un groupe
                  </button>
                </div>
              ) : (
                <div className="mobile-groups-list">
                  {groups.map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      className="mobile-group-card"
                      onClick={() => handleGroupClick(group)}
                    >
                      <img
                        src="/images/papier-theme.jpg"
                        alt={group.name}
                        className="mobile-group-card-image"
                      />
                      <div className="mobile-group-card-content">
                        <h3 className="mobile-group-card-title">{group.name}</h3>
                        <p className="mobile-group-card-info">
                          {formatDate(new Date(group.deadline))} · {group.groupMember?.length || 0}{" "}
                          {(group.groupMember?.length || 0) === 1 ? "participant" : "participants"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Add Button */}
            {groups.length > 0 && (
              <div className="mobile-groups-button-container">
                <button
                  type="button"
                  className="mobile-groups-button"
                  onClick={() => setIsCreateGroupModalOpen(true)}
                >
                  <LuCirclePlus className="text-xl" />
                  Ajouter un groupe
                </button>
              </div>
            )}
          </div>

          {/* Create / Edit Group Modal (mobile) */}
          {isCreateGroupModalOpen && (
            <Modal
              colour="blue"
              isOpen={isCreateGroupModalOpen}
              onClose={() => setIsCreateGroupModalOpen(false)}
              size="lg"
              withPadding
              className="p-0 overflow-y-auto max-h-[72vh] max-md:max-h-full"
            >
              <GroupFormindex
                onSuccess={() => setIsCreateGroupModalOpen(false)}
                onCancel={() => setIsCreateGroupModalOpen(false)}
              />
            </Modal>
          )}
        </div>

        {/* Chat/Wishlist/Cagnotte Views - slides over groups */}
        <div
          className={getChatViewClasses()}
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {/* Common Header for all views (Chat, Wishlist, Cagnotte) */}
          {indexGroups !== -1 && groups.length > 0 && (
            <div className="mobile-chat-header">
              <button
                type="button"
                className="mobile-chat-back"
                onClick={handleBackToGroups}
                aria-label="Retour"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div className="mobile-chat-title">
                <h2>{groups[indexGroups].name}</h2>
                <p>{getHeaderSubtitle()}</p>
              </div>
              <div ref={groupMenuRef} className="relative">
                <button
                  type="button"
                  className="mobile-chat-menu"
                  aria-label="Menu"
                  onClick={() => setIsGroupMenuOpen((prev) => !prev)}
                >
                  <HiDotsVertical className="text-xl" />
                </button>
                {isGroupMenuOpen && (
                  <DropdownMenu
                    width={250}
                    items={[
                      {
                        label: "Paramètres du groupe",
                        icon: <LuSettings />,
                        onClick: () => {
                          setIsGroupMenuOpen(false);
                          setIsEditGroupModalOpen(true);
                        },
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          )}

          {/* Modale paramètres du groupe */}
          {isEditGroupModalOpen && selectedGroupId && (
            <Modal
              isOpen={isEditGroupModalOpen}
              onClose={() => setIsEditGroupModalOpen(false)}
              colour="blue"
              size="lg"
              withPadding
              className="p-0 overflow-y-auto max-h-[72vh] max-md:max-h-full max-md:overflow-y-auto"
            >
              <GroupFormindex
                groupId={selectedGroupId}
                onSuccess={() => {
                  setIsEditGroupModalOpen(false);
                  refetchGroups();
                }}
                onCancel={() => setIsEditGroupModalOpen(false)}
              />
            </Modal>
          )}

          {/* Chat View */}
          {mobileView === "chat" && indexGroups !== -1 && groups.length > 0 && (
            <div className="mobile-chat-content">
              {messages[Number(groups[indexGroups].id)] !== undefined && (
                <Messaging
                  title={groups[indexGroups].name}
                  participants={groups[indexGroups].groupMember?.length || 0}
                  date={new Date(groups[indexGroups].deadline)}
                  groupId={Number(groups[indexGroups].id)}
                  messages={messages[Number(groups[indexGroups].id)]}
                  calbackSendMessage={chat.sendMessage}
                  contenairMessageRef={contenairMessageRef}
                  isMobile={true}
                  hideHeader={true}
                />
              )}
            </div>
          )}

          {/* Wishlist View */}
          {mobileView === "wishlist" && indexGroups !== -1 && groups[indexGroups] && (
            <div className="mobile-subview-content mobile-wishlist-bg">
              <Wishlist
                groupId={Number(groups[indexGroups].id)}
                beneficiaryItems={beneficiaryItems}
                groupItems={groupItems}
                onAddIdea={() => refetchWishlist()}
              />
            </div>
          )}

          {/* Cagnotte View */}
          {mobileView === "cagnotte" && indexGroups !== -1 && groups[indexGroups] && (
            <div className="mobile-subview-content mobile-cagnotte-bg">
              <div className="mobile-cagnotte-amount">
                <p className="mobile-cagnotte-amount-value">{groups[indexGroups]?.piggy_bank || 0}€</p>
                <p className="mobile-cagnotte-amount-label">Cagnotte actuelle</p>
              </div>

              {/* Button */}
              <div className="mobile-subview-button-container">
                <button
                  type="button"
                  className="mobile-subview-button"
                  onClick={() => setIsAddFundsModalOpen(true)}
                >
                  <LuCirclePlus className="text-xl" />
                  Ajouter des fonds
                </button>
              </div>

              {/* Add Funds Modal for Mobile */}
              <AddFundsModal
                isOpen={isAddFundsModalOpen}
                onClose={() => setIsAddFundsModalOpen(false)}
                onSuccess={() => refetchGroups()}
                groupId={Number(groups[indexGroups].id)}
                currentAmount={groups[indexGroups]?.piggy_bank || 0}
              />
            </div>
          )}

          {/* Bottom Buttons */}
          {mobileView !== "groups" && (
            <MobileBottomButtons
              currentView={mobileView as MobileView}
              onChatClick={() => handleMobileViewChange("chat")}
              onWishlistClick={() => handleMobileViewChange("wishlist")}
              onCagnotteClick={() => handleMobileViewChange("cagnotte")}
            />
          )}
        </div>
      </div>
    );
  }

  // Desktop render (original layout)
  return (
    <div className="flex flex-row h-full justify-around w-full relative ">
      {/* Left Column */}
      <div className="flex flex-col mx-[calc(var(--spacing)*10)] h-full min-h-0">
        <div className="h-[calc(50%-2rem)] flex">
          {myGroups && (
            <Groups
              groups={myGroups}
              setActiveGroup={setActiveGroup}
              loading={false}
              error={undefined}
              messages={messages}
              getNbNewMessages={getNbNewMessages}
              updateLastVu={updateLastVu}
              activeGroupId={
                indexGroups !== -1 && groups[indexGroups] ? Number(groups[indexGroups].id) : undefined
              }
            />
          )}
        </div>

        <div className="flex flex-row gap-4 mt-[calc(var(--spacing)*10)] mb-4">
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
            icon="piggyBank"
            colour="yellow"
            onClick={() => {
              setWishlist(false);
            }}
          />
        </div>

        <div className="h-[calc(50%-2rem)] flex">
          {indexGroups !== -1 &&
            groups.length > 0 &&
            groups[indexGroups] &&
            (wishlist ? (
              <Wishlist
                groupId={Number(groups[indexGroups].id)}
                beneficiaryItems={beneficiaryItems}
                groupItems={groupItems}
                onAddIdea={() => refetchWishlist()}
              />
            ) : (
              <PiggyBank
                pot={groups[indexGroups].piggy_bank}
                onAddFunds={() => setIsAddFundsModalOpen(true)}
              />
            ))}
        </div>

        {/* Add Funds Modal */}
        {indexGroups !== -1 && groups[indexGroups] && (
          <AddFundsModal
            isOpen={isAddFundsModalOpen}
            onClose={() => setIsAddFundsModalOpen(false)}
            onSuccess={() => refetchGroups()}
            groupId={Number(groups[indexGroups].id)}
            currentAmount={groups[indexGroups].piggy_bank}
          />
        )}
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
              addMessages={(
                message: GetAllMessageMyGroupsQuery["getAllMessageMyGroups"][number]["messages"],
              ) => addMessage(Number(groups[indexGroups].id), message)}
              calbackSendMessage={chat.sendMessage}
              contenairMessageRef={contenairMessageRef}
              updateLastVu={updateLastVu}
              getLastVu={getLastVu}
              getNbNewMessages={getNbNewMessages}
            />
          )}
      </div>
    </div>
  );
}
