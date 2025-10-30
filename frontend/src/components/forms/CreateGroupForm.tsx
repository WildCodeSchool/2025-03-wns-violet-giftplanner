import Button from "../utils/Button";
import Input from "../utils/Input";
import Title from "../utils/Title";
import { useSanitizedForm } from "../../hooks/useSanitizedForm";
import { countdownDate } from "../../utils/dateCalculator";

type FormValues = {
    groupName: string;
    recipientEmail: string;
    budget: string;
    eventDate: string;
};

function validate(values: FormValues) {
    const errors: Partial<Record<keyof FormValues, string>> = {};

    if (!values.recipientEmail) errors.recipientEmail = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(values.recipientEmail)) errors.recipientEmail = "Invalid email.";

    if (!values.groupName) errors.groupName = "Group Name is required.";
    else if (values.groupName.length < 6)
    errors.groupName = "Group name must be at least 6 characters.";

    if (!values.budget) errors.budget = "Budget is required.";
    else if (isNaN(Number(values.budget)) || Number(values.budget) <= 0)
    errors.budget = "Budget must be a positive number.";

    if(!values.eventDate) errors.eventDate = "Event Date is required.";
    else if(countdownDate(new Date(values.eventDate)) < 0) errors.eventDate = "Event date cannot be in the past.";

    return errors;
}

export default function CreateGroupForm() {
    const { formData, handleChange, getSanitizedData, errors, isValid} = useSanitizedForm({
        groupName: "",
        recipientEmail: "",
        budget: "",
        eventDate: ""
    }, validate);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const sanitizedData = getSanitizedData();

        if(isValid) {
          console.log("Form submitted", sanitizedData);
          return;
        }

        console.log("Form has errors, cannot submit.", errors);
    }

    return (
        <form className=" flex w-full h-full" onSubmit={handleSubmit}>
                <div className="bg-green w-1/2 h-full flex flex-col p-4">
                  {/* Form to create a new group */}
                  <Title className="text-center">Créer un nouveau groupe</Title>
                  <div className="flex h-full flex-col justify-evenly my-10 px-10">
                    <Input
                      name="groupName"
                      label= "Nom du groupe"
                      type="text"
                      value={formData.groupName}
                      onChange={handleChange}
                      placeholder="Entrez le nom du groupe"
                      error={errors.groupName}
                    />

                    <Input
                      name="recipientEmail"
                      label="Email du destinataire"
                      type="text"
                      value={formData.recipientEmail}
                      onChange={handleChange}
                      placeholder="Adresse email du destinataire du cadeau"
                      error={errors.recipientEmail}
                    />

                    <Input
                      name="budget"
                      label="Cagnotte"
                      type="number"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Combien aimeriez-vous récolter?"
                      error={errors.budget}
                    />

                    <Input
                      name="eventDate"
                      label="Date de l'événement"
                      type="date"
                      value={formData.eventDate}
                      onChange={handleChange}
                      placeholder="Sélectionnez une date"
                      error={errors.eventDate}
                    />
                  </div>
                  
                </div>
                
                <div className="w-1/2 bg-blue">
                  {/* Adding users can go here */}
                  <p>Ici, il y aura l'option d'ajouter les participants</p>
                </div>

                <Button
                  type="submit"
                  text="Créer le groupe"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2"
                  colour="dark"
                >
                  Help
                </Button>

            </form>

    );
}