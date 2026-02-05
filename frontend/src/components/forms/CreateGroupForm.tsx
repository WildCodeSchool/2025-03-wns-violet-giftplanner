import type React from "react";
import { useState } from "react";
import { useCreateGroupMutation } from "../../graphql/generated/graphql-types";
import { GET_ALL_MY_GROUPS } from "../../graphql/operations/groupOperations";
import { groupCreationFormValidation } from "../../hooks/formValidationRules";
import { useSanitizedForm } from "../../hooks/useSanitizedForm";
import Icon from "../utils/Icon";
import Input from "../utils/Input";
import InputWithToggle from "../utils/InputWithToggle";
import ResponsiveImage from "../utils/ResponsiveImage";
import SearchSelectInput from "../utils/SearchSelectInput";
import Subtitle from "../utils/Subtitle";
import GroupLink from "./GroupLink";

type CreateGroupFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function CreateGroupForm({ onSuccess, onCancel }: CreateGroupFormProps) {
  const options = [
    {
      label: "Anniversaire",
      value: "Anniversaire",
    },
    {
      label: "Marriage",
      value: "Marriage",
    },
    {
      label: "Naissance",
      value: "Naissance",
    },
    {
      label: "Pot de départ",
      value: "Pot de départ",
    },
    {
      label: "Noël",
      value: "Noël",
    },
  ];

  // const [query, setQuery] = useState("");
  const [checked, setChecked] = useState(false);

  const { formData, handleChange, getSanitizedData, errors, isValid, setFormData, isEmpty } =
    useSanitizedForm(
      {
        name: "",
        event_type: "",
        piggy_bank: 0,
        deadline: "",
        users: [] as string[],
        user_beneficiary: "",
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
          user_beneficiary: "", //Do not reset users here instead show the list of existing users
        });

        setChecked(false);

        // Close the parent modal if provided
        if (onSuccess) onSuccess();
      } catch (error: unknown) {
        console.error("Error creating group:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Une erreur est survenue");
        }
      }
    }

    console.error("Form has errors, cannot submit.", errors);
  }

  return (
    <form
      className="flex w-full h-full rounded-2xl max-md:flex-col max-md:bg-green max-md:rounded-none max-md:overflow-y-auto max-md:p-8 max-md:justify-center"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="bg-green w-1/2 h-full flex flex-col justify-center pt-10 pb-5 rounded-tl-2xl rounded-bl-2xl max-md:w-full max-md:rounded-none max-md:pt-0 max-md:pb-0">
        {/* Form to create a new group */}
        <Subtitle className="text-center text-2xl max-md:text-xl max-md:mb-10">Créer un groupe</Subtitle>
        <div className="text-white text-8xl m-auto max-md:hidden">
          <Icon icon="image" />
        </div>
        <div className="flex flex-col gap-4 px-20 max-md:px-0">
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
            options={options}
            theme="light"
          />

          <InputWithToggle
            checked={checked}
            onCheckedChange={() => {
              setChecked(!checked);
            }}
            name="user_beneficiary"
            value={formData.user_beneficiary}
            onChange={handleChange}
            label="Le nom du destinataire"
            question="Voulez-vous ajouter un destinataire? "
            error={errors.user_beneficiary}
          />

          <Input
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            error={errors.deadline}
          />
        </div>
        <div className="flex flex-col gap-6 max-md:w-full max-md:mt-8">
          <button
            type="submit"
            className="bg-dark text-white font-inter-extra-bold rounded-lg py-2 px-8 w-fit m-auto text-lg shadow-md hover:brightness-110 max-md:w-full max-md:py-3 max-md:rounded-full max-md:text-base max-md:font-bold max-md:shadow-[0_2px_6px_rgba(32,9,4,0.2)] max-md:bg-white max-md:text-dark max-md:hover:bg-gray-100"
          >
            Créer le groupe
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="hidden max-md:block w-full py-3 rounded-full bg-dark text-white text-base font-bold shadow-[0_2px_6px_rgba(32,9,4,0.2)] hover:bg-[#463835]"
            >
              Annuler
            </button>
          )}
        </div>
        {error && <p className="text-orange font-inter text-sm pt-1 text-center">{error}</p>}
        {errors.main && <p className="text-orange font-inter text-sm pt-1 text-center">{errors.main}</p>}
      </div>

      <div className="w-1/2 bg-white h-full flex flex-col rounded-tr-2xl rounded-br-2xl max-md:hidden">
        <div className="flex flex-col gap-4 px-20 m-auto">
          {/* Adding users can go here */}
          <div className="flex flex-row items-center w-full border border-blue">
            <GroupLink />
            <ResponsiveImage src={`/images/papier-theme.jpg`} alt="QR Code" maxWidth="w-64" rounded />
          </div>

          {/* TO DO: reintegrer le user input
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
          /> */}
        </div>
      </div>
    </form>
  );
}
