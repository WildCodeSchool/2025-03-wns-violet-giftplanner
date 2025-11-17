import Input from "../utils/Input";
import SearchInput from "../utils/SearchInput";

// créer et importer un composant qui ajoute les utilisateurs comme des labels avec une option de les supprimer et une liste déroulante
// avec la liste des utilisateurs disponibles

// ajout d'un qr code pour inviter des utilisateurs au groupe

export default function ManageUsersForm () {
    return (

        <SearchInput
            placeholder="Ajouter des participants..."
            icon="search"
            theme="dark"
            name="users"
            value="users"
            onChange={() => {}}
        
        />

    )
}