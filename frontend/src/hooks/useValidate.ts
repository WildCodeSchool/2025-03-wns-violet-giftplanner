import type { CreateGroupInput } from "../generated/graphql-types";
import { countdownDate } from "../utils/dateCalculator";

// Turn all fields into strings (because form inputs return strings)
type FormValues = {
  [K in keyof CreateGroupInput]: string;
};

export default function validate(values: FormValues) {
    const errors: Partial<Record<keyof FormValues, string>> = {};

    if (!values.event_type) errors.event_type = "What is the occasion?";
    else if (values.name.length < 6) errors.event_type = "Too short...";

    if (!values.name) errors.name = "Group Name is required.";
    else if (values.name.length < 6)
    errors.name = "Group name must be at least 6 characters.";

    if (!values.piggy_bank) errors.piggy_bank = "Budget is required.";
    else if (isNaN(Number(values.piggy_bank)) || Number(values.piggy_bank) <= 0)
    errors.piggy_bank = "Budget must be a positive number.";

    if(!values.deadline) errors.deadline = "Event Date is required.";
    else if(countdownDate(new Date(values.deadline)) < 0) errors.deadline = "Event date cannot be in the past.";

    return errors;
}