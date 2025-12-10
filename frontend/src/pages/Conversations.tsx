import React, { useEffect, useState } from "react";
import Groups from "../components/Groups/Groups";
import Messaging from "../components/Groups/Messaging/Messaging";
import PiggyBank from "../components/Groups/PiggyBank";
import Wishlist from "../components/Groups/Wishlist";
import Button from "../components/utils/Button";
import { useGetAllMyGroupsQuery } from "../generated/graphql-types";
import type { GetAllMyGroupsQuery } from "../generated/graphql-types";

export default function Conversations() {
  const { data, loading, error } = useGetAllMyGroupsQuery();
  const [whislist, setWishlist] = React.useState(true);
  const [groups, setGroups] = useState<GetAllMyGroupsQuery["getAllMyGroups"]>([]);
  const [activeGroup, setActiveGroup] = React.useState<GetAllMyGroupsQuery["getAllMyGroups"][0] | null>(null);

  useEffect(() => {
    // waiting for data to load
    if (!data?.getAllMyGroups) return;
    

    if (data.getAllMyGroups.length === 0) {
      setActiveGroup(null);
      return;
    }

    setGroups(data.getAllMyGroups);

    //keep active group in sync or default to first during refetch
    const existing = activeGroup
      ? data.getAllMyGroups.find((group) => Number(group.id) === Number(activeGroup.id))
      : null;

    setActiveGroup(existing ?? data.getAllMyGroups[0]);
  }, [data, activeGroup]);


  //TO DO: set activeGroup.id in url

  return (
    <div className="flex flex-row h-full justify-around w-full relative ">
      {/* Left Column */}
      <div className="flex flex-col mx-[2vw] h-full min-h-0 justify-between">
        <div className="h-[calc(50%-2rem)] flex pb-2 ">
          <Groups
            groups={groups}
            setActiveGroup={setActiveGroup}
            loading={loading}
            error={error?.message}
          />
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
              <Wishlist />
            ) : (
              <PiggyBank pot={activeGroup.piggy_bank} />
            ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-1 w-1/2 h-full  mt-0 overflow-y-auto justify-center">
        {activeGroup && (
          <Messaging
            title={activeGroup.name}
            participants={activeGroup.groupMember.length}
            date={new Date(activeGroup.deadline)}
            groupId={Number(activeGroup.id)}
            messages={activeGroup.messages}
          />
        )}
      </div>
    </div>
  );
}
