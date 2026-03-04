import type { Dispatch, SetStateAction } from "react";
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
  items: string[];
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
  onRemoveMember,
}: handleUsersFormProps) {
  return (
    <div className="flex flex-col h-full w-full py-2 md:py-4 md:my-5 md:px-10 lg:px-20 gap-4">
      <div className="flex flex-col w-full overflow-y-hidden">
        <SearchInput
          disabled={isEdit && !isAdmin}
          placeholder="Ajouter des participants..."
          theme="light"
          name="users"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          items={[...items]}
          error={errors.users}
          onClick={(email: string) => {
            setFormData((prev: any) => ({
              ...prev,
              users: prev?.users?.filter((user: string) => user !== email),
            }));
            if (onRemoveMember) {
              onRemoveMember(email);
            }
          }}
          onAddTag={onAddTag}
        />
      </div>
    </div>
  );
}
