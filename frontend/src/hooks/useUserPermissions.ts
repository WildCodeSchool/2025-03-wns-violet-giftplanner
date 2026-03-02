import type { Group } from "../graphql/generated/graphql-types";
import type { UserProfile } from "../zustand/myProfileStore";
import { useMyProfileStore } from "../zustand/myProfileStore";

type UseUserPermissionsResult = {
  currentUser: UserProfile | null;
  isAdmin: boolean;
};

export function useUserPermissions(group?: Group): UseUserPermissionsResult {
  const currentUser = useMyProfileStore((s) => s.userProfile);

  const isAdmin = !!group && !!currentUser && group.user_admin?.id === currentUser.id;

  return {
    currentUser,
    isAdmin,
  };
}
