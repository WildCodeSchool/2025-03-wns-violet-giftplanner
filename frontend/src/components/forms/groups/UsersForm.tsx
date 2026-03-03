import type { Dispatch, SetStateAction } from "react";
import {
  useDeleteGroupMutation,
  useRemoveMembersFromGroupMutation,
} from "../../../graphql/generated/graphql-types";
import Button from "../../utils/Button";
import SearchInput from "../../utils/SearchInput";

// For testing: 30 fictional emails
// const FICTIONAL_TEST_EMAILS = [
//   "lucas.martin@gmail.com",
//   "emma.dupont@yahoo.fr",
//   "noah.legrand@outlook.com",
//   "chloe.bernard@icloud.com",
//   "gabriel.moreau@protonmail.com",
//   "lea.fournier@hotmail.fr",
//   "hugo.lambert@gmail.com",
//   "manon.bonnet@orange.fr",
//   "louis.francois@live.fr",
//   "jade.girard@yahoo.com",
//   "arthur.robert@icloud.com",
//   "camille.richard@gmail.com",
//   "nathan.durand@outlook.fr",
//   "clara.leroy@protonmail.com",
//   "tom.moreau@gmail.com",
//   "ines.simon@yahoo.fr",
//   "theo.laurent@icloud.com",
//   "sarah.lefebvre@hotmail.com",
//   "mathis.michel@gmail.com",
//   "lina.garcia@outlook.com",
//   "enzo.david@live.com",
//   "eva.roux@gmail.com",
//   "alexandre.vincent@protonmail.fr",
//   "juliette.muller@yahoo.com",
//   "antoine.faure@icloud.com",
//   "louise.andre@gmail.com",
//   "maxime.mercier@outlook.com",
//   "zoe.boyer@hotmail.fr",
//   "paul.gauthier@gmail.com",
//   "elise.chevalier@orange.fr",
// ];

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
    <div className="flex flex-col h-full w-full py-4 my-5 md:px-10 lg:px-20 gap-4">
      <div className="flex flex-col w-full overflow-y-hidden">
        <SearchInput
          disabled={isEdit && !isAdmin}
          placeholder="Ajouter des participants..."
          theme="dark"
          name="users"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // ✅ correct
          items={[...items]} // add ...FICTIONAL_TEST_EMAILS to the array to test
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
      </div>
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
