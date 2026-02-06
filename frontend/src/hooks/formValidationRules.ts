import type { CreateGroupInput } from "../graphql/generated/graphql-types";
import { countdownDate } from "../utils/dateCalculator";
import { verifyEmail } from "./verifyEmail";

export type GroupFormErrors = Partial<Record<keyof CreateGroupInput, string>> & {
  main?: string;
};

export function groupCreationFormValidation(values: CreateGroupInput) {
  const errors: GroupFormErrors = {};

  if (!values.event_type) errors.event_type = "Veuillez-sélectionner le type d'évènement";

  if (!values.name) errors.name = "Le nom du groupe est requis";
  else if (values.name.length < 6) errors.name = "Le nom du groupe doit faire au moins 6 charactères de long";

  if (!values.deadline) errors.deadline = "La date butoire de l'évènement est requise";
  else if (countdownDate(new Date(values.deadline)) < 0)
    errors.deadline = "La date ne peut pas être dans le passé";

  //If all values are empty
  if (!values.deadline && !values.event_type && !values.name && !values.user_beneficiary) {
    errors.main = "Les champs doivent être rempli";
  }

  if (values.user_beneficiary && values.users) {
    //verify beneficiary is not in users
    if (values.users?.find((user) => user === values.user_beneficiary)) {
      errors.user_beneficiary = "Le bénéficiaire ne peut pas être un membre du groupe.";
      errors.users = "Le bénéficiaire ne peut pas être un membre du groupe.";
    }
  }

  if (values.user_beneficiary) {
    if (verifyEmail(values.user_beneficiary)) errors.user_beneficiary = "L'adresse email n'est pas valide";
  }

  if (values.users && values.users.length > 0) {
    const uniqueUsers = new Set(values.users);
    //Set makes a copy of unique values

    if (uniqueUsers.size !== values.users.length) {
      errors.users = "L'utilisateur existe déjà dans ce groupe.";
    }
  }

  return errors;
}
