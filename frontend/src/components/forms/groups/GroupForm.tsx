import type React from "react";
import Icon from "../../utils/Icon";
import Input from "../../utils/Input";
import InputWithToggle from "../../utils/InputWithToggle";
import SearchSelectInput from "../../utils/SearchSelectInput";
import Subtitle from "../../utils/Subtitle";
import { options } from "../groups/eventOptions.ts";

type GroupFormProps = {
  onSuccess?: () => void;
  /** When provided, the form works in edit mode and pre-populates with the group data */
  groupId?: number;
  formData: any;
  errors:any
  isEdit: boolean;
  handleChange: any;
  checked: boolean;
  setChecked: any
};


export default function GroupForm({ formData, errors, checked, setChecked, isEdit, handleChange }: GroupFormProps) {

  return (
        <>
          <Subtitle className="text-center text-2xl">
            {isEdit ? "Modifier le groupe" : "Créer un groupe"}
          </Subtitle>
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
              options={options}
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
              onCheckedChange={() => {
                setChecked(!checked);
              }}
              name="user_beneficiary"
              value={formData.user_beneficiary ?? ""}
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
        
    
      
        
          
        </>
    
  );
}

