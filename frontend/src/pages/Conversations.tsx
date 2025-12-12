import React, { useEffect, useState } from "react";
import Groups from "../components/groups/Groups";
import Messaging from "../components/groups/Messaging/Messaging";
import Wishlist from "../components/groups/Wishlist";
import Button from "../components/utils/Button";
import type { GetAllMyGroupsQuery } from "../generated/graphql-types";
import { useGetAllMyGroupsQuery, useGroupWishlistItemsQuery } from "../generated/graphql-types";

export default function Conversations() {
  // const { data: groupData, loading, error } = useGetAllMyGroupsQuery();
  const [wishlist, setWishlist] = React.useState(true);

  const { data: groupData } = useGetAllMyGroupsQuery();
  const [groups, setGroups] = useState<GetAllMyGroupsQuery["getAllMyGroups"]>([]);

  const [activeGroupId, setActiveGroupId] = React.useState<Number | null>(null);
  const [activeGroup, setActiveGroup] = React.useState<GetAllMyGroupsQuery["getAllMyGroups"][0] | null>(null);

  useEffect(() => {
    setGroups(groupData?.getAllMyGroups || []);
  }, [groupData]);

  useEffect(() => {
    if (activeGroupId === null) {
      setActiveGroup(null);
      return;
    }
    setActiveGroup(groups.find((g) => Number(g.id) === activeGroupId) || null);
  }, [activeGroupId]);

  const activeGroupIdNumber = activeGroup ? Number(activeGroup.id) : undefined;

  const {
    data: groupWishlistData,
    // loading: groupWishlistLoading,
    // error: groupWishlistError,
  } = useGroupWishlistItemsQuery({
    variables: { groupId: activeGroupIdNumber ?? 0 },
    skip: !activeGroupIdNumber, // don't call the query when no group is selected
  });

  const beneficiaryItems = groupWishlistData?.groupWishlistItems.fromWishlist ?? [];
  const groupItems = groupWishlistData?.groupWishlistItems.fromGroupList ?? [];

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

        {activeGroup && wishlist && (
          <Wishlist beneficiaryItems={beneficiaryItems} groupItems={groupItems} onAddIdea={() => {}} />
        )}

        {/* <div className="h-[calc(50%-2rem)] flex pt-2">
          {activeGroup &&
            (wishlist ? (
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
          />
        )}
      </div>
    </div>
  );
}
