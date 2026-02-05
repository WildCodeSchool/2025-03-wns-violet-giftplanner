import type { Dispatch, SetStateAction } from "react";
import {
  useDeleteGroupMutation,
  useRemoveMembersFromGroupMutation,
} from "../../../graphql/generated/graphql-types";
import Button from "../../utils/Button";
import SearchInput from "../../utils/SearchInput";

type handleUsersFormProps = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  setFormData: (updater: (prev: any) => any) => void;
  errors: any;
  onAddTag: (email: string) => void;
  isEdit: boolean;
  isAdmin: boolean;
  groupId: number;
  currentUser: any;
  items: string[];
  onSuccess?: () => void;
  onRemoveMember?: (email: string) => void;
};

export default function UsersForm({
  query,
  setQuery,
  onAddTag,
  items,
  setFormData,
  errors,
  isAdmin,
  isEdit,
  groupId,
  currentUser,
  onSuccess,
  onRemoveMember,
}: handleUsersFormProps) {
  const [deleteGroup] = useDeleteGroupMutation();
  const [removeMembers] = useRemoveMembersFromGroupMutation();

  async function leaveGroup() {
    if (!currentUser?.id) return;
    try {
      await removeMembers({
        variables: {
          groupId: groupId,
          data: {
            userIds: [Number(currentUser.id)],
          },
        },
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  }

  async function deleteMyGroup() {
    try {
      await deleteGroup({
        variables: {
          deleteGroupId: groupId,
        },
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  }

  return (
    <div className="flex flex-col gap-4 px-20 m-auto">
      <SearchInput
        disabled={isEdit && !isAdmin}
        placeholder="Ajouter des participants..."
        theme="dark"
        name="users"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // ✅ correct
        items={items}
        error={errors.users}
        onClick={(email: string) => {
          setFormData((prev: any) => ({
            ...prev,
            users: prev?.users?.filter((user: string) => user !== email),
          }));
          // Notify parent component about member removal
          if (onRemoveMember) {
            onRemoveMember(email);
          }
        }}
        onAddTag={onAddTag}
      />
      {!isAdmin && isEdit && (
        <Button colour="orange" onClick={leaveGroup}>
          Quitter le groupe
        </Button>
      )}
      {isAdmin && isEdit && (
        <Button colour="orange" onClick={deleteMyGroup}>
          Supprimer le groupe
        </Button>
      )}
    </div>
  );
}
