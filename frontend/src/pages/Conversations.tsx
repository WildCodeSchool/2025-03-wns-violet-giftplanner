import React from "react";
import data from "../components/groups/data/data.json";
import Groups from "../components/groups/Groups";
import Messaging from "../components/groups/Messaging/Messaging";
import PiggyBank from "../components/groups/PiggyBank";
import Wishlist from "../components/groups/Wishlist";
import Button from "../components/utils/Button";
import type { GroupProps } from "../types/Groups";

export default function Conversations() {
  const myGroups: GroupProps[] = data.groups.map((group: any) => ({
    ...group,
    messages: group.messages.map((msg: any) => ({
      ...msg,
      align: msg.align === "left" ? "left" : "right",
    })),
  }));

  const [activeGroupId, setActiveGroupId] = React.useState<GroupProps["id"]>(myGroups[0].id);

  const activeGroup = myGroups.find((group) => group.id === activeGroupId);

  //TO DO: set activeGroup.id in url

  const [whislist, setWishlist] = React.useState(true);

  return (
    <div className="flex flex-row h-full justify-around w-full relative ">
      {/* Left Column */}
      <div className="flex flex-col mx-[2vw] h-full min-h-0 justify-between">
        <div className="h-[calc(50%-2rem)] flex pb-2 ">
          <Groups groups={myGroups} setActiveGroup={setActiveGroupId} />
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
          {activeGroup &&
            (whislist ? (
              <Wishlist wishlistItems={activeGroup.wishlist} />
            ) : (
              <PiggyBank pot={activeGroup.fund} />
            ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-1 w-1/2 h-full  mt-0 overflow-y-auto justify-center">
        {activeGroup && (
          <Messaging
            title={activeGroup.title}
            participants={activeGroup.participants}
            date={new Date(activeGroup.date)}
            messages={activeGroup.messages}
          />
        )}
      </div>
    </div>
  );
}
