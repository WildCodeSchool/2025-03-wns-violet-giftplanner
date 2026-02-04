import SearchInput from "../../utils/SearchInput";
import Button from "../../utils/Button";

type handleUsersFormProps = {
    query: any;
    setQuery: any;
    handleChange?: any;
    formData: any;
    setFormData: any;
    errors: any;
    onAddTag: any;
    isEdit: boolean;
    isAdmin: boolean;
}

export default function UsersForm({query, setQuery, onAddTag, formData, setFormData, errors,isAdmin,isEdit}: handleUsersFormProps) {

  function leaveGroup () {
    console.log("leave")

  }

  function deleteGroup () {
    console.log ("delete")
  }
    return (
        <div className="flex flex-col gap-4 px-20 m-auto">
            <SearchInput
                    placeholder="Ajouter des participants..."
                    theme="dark"
                    name="users"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)} // ✅ correct
                    items={formData.users ?? []}
                    error={errors.users}
                    onClick={(email) => {
                        setFormData((prev) => ({
                        ...prev,
                        users: prev?.users?.filter((user) => user !== email),
                        }));
                    }}
                    onAddTag={onAddTag}
                    />
                    {!isAdmin && isEdit && <Button colour="orange" onClick={leaveGroup}>Quitter le groupe</Button>}
                    {isAdmin && isEdit && <Button colour="orange" onClick={deleteGroup}>Supprimer le groupe</Button> }
      </div>
        
    )
}