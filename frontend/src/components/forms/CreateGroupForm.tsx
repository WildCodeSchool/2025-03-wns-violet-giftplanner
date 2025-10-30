import Button from "../utils/Button";
import Input from "../utils/Input";
import Title from "../utils/Title";
import Icon from "../utils/Icon";
import { useSanitizedForm } from "../../hooks/useSanitizedForm";
import { countdownDate } from "../../utils/dateCalculator";
import { useCreateGroupMutation } from "../../generated/graphql-types";

type FormValues = {
    name: string;
    event_type: string;
    piggy_bank: number;
    deadline: string;
};

function validate(values: FormValues) {
    const errors: Partial<Record<keyof FormValues, string>> = {};

    if (!values.event_type) errors.event_type = "What is the occasion?";
    else if (values.name.length < 3) errors.event_type = "Too short...";

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

export default function CreateGroupForm() {
    const { formData, handleChange, getSanitizedData, errors, isValid, setFormData} = useSanitizedForm({
        name: "",
        event_type: "",
        piggy_bank: 0,
        deadline: ""
    }, validate);

    const [createGroup] = useCreateGroupMutation();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if(isValid) {
          try {
            const sanitizedData = getSanitizedData();
            if (!sanitizedData) {
              console.error("Sanitized data is null or undefined.");
              return;
            }

            const response = await createGroup({
              variables: { data : {
                ...sanitizedData, 
                piggy_bank: Number(sanitizedData?.piggy_bank), 
                deadline: new Date(sanitizedData?.deadline)
              } }
            })

            console.log("Group created successfully:", response.data);
            setFormData({
              name: "",
              event_type: "",
              piggy_bank: 0,
              deadline: ""
            })
          }
          catch (error) {
            console.error("Error creating group:", error);
          }
        }

        console.log("Form has errors, cannot submit.", errors);
    }

    return (
      <>
        <form className=" flex w-full h-full" onSubmit={handleSubmit}>
                <div className="bg-green w-1/2 h-full flex flex-col justify-center py-5">
                  {/* Form to create a new group */}
                  <Title className="text-center text-3xl">Créer un groupe</Title>
                  <div className="text-white text-9xl m-auto">
                    <Icon icon="image" text="" />
                  </div>
                  <div className="flex flex-col gap-7 px-10">
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Entrez le nom du groupe"
                      error={errors.name}
                      icon="doubleChat"
                    />

                    <Input
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
                      placeholder={String(formData.piggy_bank)}
                      error={errors.piggy_bank}
                      icon="dollar"
                    />

                    <Input
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleChange}
                      placeholder="Sélectionnez une date de fin"
                      error={errors.deadline}
                    />
                  </div>                
                </div>
                
                <div className="w-1/2 bg-white">
                  {/* Adding users can go here */}
                  <p>Ici, il y aura l'option d'ajouter les participants</p>
                </div>

                

            </form>
            <Button
                  type="submit"
                  text="Créer le groupe"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-10 text-2xl"
                  colour="dark"
                  rounded
                >
                  Créer
                </Button>
          
          
          </>

    );
}