import { useState } from "react";
import { useCreateGroupMutation } from "../../generated/graphql-types";
import { groupCreationFormValidation } from "../../hooks/formValidationRules";
import { useSanitizedForm } from "../../hooks/useSanitizedForm";
import Button from "../utils/Button";
import Icon from "../utils/Icon";
import Input from "../utils/Input";
import Title from "../utils/Title";

export default function CreateGroupForm() {
  const { formData, handleChange, getSanitizedData, errors, isValid, setFormData, isEmpty } =
    useSanitizedForm(
      {
        name: "",
        event_type: "",
        piggy_bank: 0,
        deadline: "",
      },
      groupCreationFormValidation,
    );

  const [error, setError] = useState<string>("");

  const [createGroup] = useCreateGroupMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEmpty) {
      console.info("Form is empty.");
      setError("Etre bref c'est bien, mais il faut quand même remplir le formulaire");

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
        });
        // TO DO: fermer la modale après création puis afficher le nouveau groupe dans la liste des groupes
      } catch (error) {
        console.error("Error creating group:", error);
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

          <Input //TODO: faire un select avec des options types d'événements
            name="event_type"
            type="text"
            value={formData.event_type}
            onChange={handleChange}
            placeholder="Quel est l'événement ?"
            error={errors.event_type}
            icon="gift"
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

          <Input //TODO: Afficher le date aujourd'hui par defaut
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            error={errors.deadline}
          />

          {/* Ajouter l'option d'ajouter le destinataire*/}
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
      </div>

      <div className="w-1/2 bg-white rounded-tr-2xl rounded-br-2xl">
        {/* Adding users can go here */}
        <p>Ici, il y aura l'option d'ajouter les participants</p>
        {error ? error : ""}
      </div>
    </form>
  );
}
