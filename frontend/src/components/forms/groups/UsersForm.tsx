import SearchInput from "../../utils/SearchInput";

type handleUsersFormProps = {
    query: any;
    setQuery: any;
    handleChange: any;
    formData: any;
    setFormData: any;
    errors: any;
}

export default function UsersForm({query, setQuery, handleChange, formData, setFormData, errors}: handleUsersFormProps) {
    return (
        <div className="flex flex-col gap-4 px-20 m-auto">
            <SearchInput
            placeholder="Ajouter des participants..."
            theme="dark"
            name="users"
            value={query}
            onChange={handleChange}
            onClick={(email) => {
              setFormData({ ...formData, users: formData.users.filter((user) => user !== email) });
            }}
            onAddTag={(email) => {
              setFormData({ ...formData, users: formData.users.filter((user) => user !== email) });
              setQuery("");
              
            }}
            items={formData.users}
            error={errors.users}
          /> 
        </div>
    )
}