import type { CreateGroupInput } from "../generated/graphql-types";
import { countdownDate } from "../utils/dateCalculator";

export function groupCreationFormValidation(values: CreateGroupInput) {
  const errors: Partial<Record<keyof CreateGroupInput, string>> = {};

  if (!values.event_type) errors.event_type = "Veuillez-sélectionner le type d'évènement";
  // else if (values.name.length < 6) errors.event_type = "Too short...";

  if (!values.name) errors.name = "Le nom du groupe est requis";
  else if (values.name.length < 6) errors.name = "Le nom du groupe doit faire au moins 6 charactères de long";

  if (!values.piggy_bank) errors.piggy_bank = "Veuillez définir une cagnotte";
  else if (Number.isNaN(Number(values.piggy_bank)) || Number(values.piggy_bank) <= 0)
    errors.piggy_bank = "La cagnotte ne peut pas être négative";

  if (!values.deadline) errors.deadline = "La date butoire de l'évènement est requise";
  else if (countdownDate(new Date(values.deadline)) < 0)
    errors.deadline = "La date ne peut pas être dans le passé";


  return errors;
}
