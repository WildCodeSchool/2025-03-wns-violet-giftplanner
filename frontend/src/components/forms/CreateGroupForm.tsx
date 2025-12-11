import type React from "react";
import { useState } from "react";
import { useCreateGroupMutation } from "../../generated/graphql-types";
import { groupCreationFormValidation } from "../../hooks/formValidationRules";
import { useSanitizedForm } from "../../hooks/useSanitizedForm";
import { GET_ALL_MY_GROUPS } from "../../graphql/operations";
import Button from "../utils/Button";
import Icon from "../utils/Icon";
import Input from "../utils/Input";
import SearchInput from "../utils/SearchInput";
import Title from "../utils/Title";
import InputWithToggle from "../utils/InputWithToggle";
import GroupLink from "./GroupLink";
import ResponsiveImage from "../utils/ResponsiveImage";
import SearchSelectInput from "../utils/SearchSelectInput";

export default function CreateGroupForm() {

  const options = [
    {
      label: "Anniversaire",
      value:"Anniversaire"
    },
    {
      label: "Marriage",
      value:"Marriage"
    },
    {
      label: "Naissance",
      value:"Naissance"
    },
    {
      label: "Pot de départ",
      value:"Pot de départ"
    },
    {
      label: "Noël",
      value:"Noël"
    },
  ]

  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState(false)
  const [userError, setUserError] = useState<string>("");
  const { formData, handleChange, getSanitizedData, errors, isValid, setFormData, isEmpty } =
    useSanitizedForm(
      {
        name: "",
        event_type: "",
        piggy_bank: 0,
        deadline: "",
        users: [] as string[],
        user_beneficiary: ""
      },
      groupCreationFormValidation,
    );

  const [error, setError] = useState<string>("");

  const [createGroup] = useCreateGroupMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_ALL_MY_GROUPS,
      },
    ],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEmpty) {
      console.info("Form is empty.");
      setError("Être bref c'est bien, mais il faut quand même remplir le formulaire");
      return;
    }
    if (isValid) {
      try {
        const sanitizedData = getSanitizedData();
        if (!sanitizedData) {
          console.error("Sanitized data is null or undefined.");
          return;
        }

        const response = await createGroup({
          variables: {
            data: {
              ...sanitizedData,
              piggy_bank: Number(sanitizedData?.piggy_bank),
              deadline: new Date(sanitizedData?.deadline),
            },
          },
        });

        console.info("Group created successfully:", response.data);
        setFormData({
          name: "",
          event_type: "",
          piggy_bank: 0,
          deadline: "",
          users: [],
          user_beneficiary: "" //Do not reset users here instead show the list of existing users
        });
        // TO DO: fermer la modale après création puis afficher le nouveau groupe dans la liste des groupes
      } catch (error) {
        console.error("Error creating group:", error);
        setError(error.message)
      }
    }

    console.error("Form has errors, cannot submit.", errors);
  }

  return (
    <form className=" flex w-full h-full rounded-2xl" onSubmit={handleSubmit} autoComplete="off">
      <div className="bg-green w-1/2 h-full flex flex-col justify-center pt-10 pb-5 rounded-tl-2xl rounded-bl-2xl">
        {/* Form to create a new group */}
        <Title className="text-center text-2xl">Créer un groupe</Title>
        <div className="text-white text-8xl m-auto">
          <Icon icon="image" />
        </div>
        <div className="flex flex-col gap-4 px-20">
          <Input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Entrez le nom du groupe"
            error={errors.name}
            icon="doubleChat"
          />

          <SearchSelectInput
            name="event_type"
            value={formData.event_type}
            onChange={(val) =>
              handleChange({
                target: { name: "event_type", value: val },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            placeholder="Quel est l'événement ?"
            error={errors.event_type}
            icon="gift"
            options = {options}
            theme="light"
          />

          <Input
            name="piggy_bank"
            type="number"
            value={String(formData.piggy_bank)}
            onChange={handleChange}
            placeholder={String(0)}
            error={errors.piggy_bank}
            icon="dollar"
          />

          <InputWithToggle 
            checked={checked}
            onCheckedChange={()=>{setChecked(!checked)}} 
            name="user_beneficiary" 
            value={formData.user_beneficiary} 
            onChange={handleChange}
            label="Le nom du destinataire"
            question="Voulez-vous ajouter un destinataire? "
            
          />

          <Input
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            error={errors.deadline}
          />
        
        </div>
        <Button
          type="submit"
          text="Créer le groupe"
          className="text-center w-fit px-8 py-1 m-auto text-lg"
          colour="dark"
          rounded
        >
          Créer
        </Button>
        {error && <p className="text-orange font-inter text-sm pt-1 text-center">{error}</p>}
      </div>

      <div className="w-1/2 bg-white h-full flex flex-col rounded-tr-2xl rounded-br-2xl">
        <div className="flex flex-col gap-4 px-20 m-auto">
          {/* Adding users can go here */}
          <div className="flex flex-row items-center w-full border border-blue">
            <GroupLink />
            <ResponsiveImage 
              src={`/images/papier-theme.jpg`}
              alt="QR Code"
              maxWidth="w-64"
              rounded
            />
          </div>

          <SearchInput
            placeholder="Ajouter des participants..."
            theme="dark"
            name="users"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setUserError("");
            }}
            onClick={(email) => {
              setFormData({ ...formData, users: formData.users.filter((u) => u !== email) });
              setUserError("");
            }}
            onAddTag={(email) => {
              // Email regex validation
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

              if (!emailRegex.test(email)) {
                setUserError("Format d'email invalide");
                return;
              }

              if (formData.users.includes(email)) {
                setUserError("Cet utilisateur est déjà dans le groupe");
                return;
              }

              setFormData({ ...formData, users: [...formData.users, email] });
              setQuery("");
              setUserError("");
            }}
            items={formData.users}
            error={userError}
          />
        </div>
      </div>
    </form>
  );
}

/**
 * TO DO:
 * - rendre ça plus lisible
 * - ajouter la gestion des erreurs pour les utilisateurs (dans les règles de validation)
 * - version mobile et web ajuster modale
 * - ajouter un bouton pour générer un QR code pour inviter des utilisateurs (mock pour l'instant)
 * - refactor pour que ce soit aussi utilisé pour modification du groupe?
 * - rendre css plus joli
 */
