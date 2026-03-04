import type React from "react";
import Input from "../../utils/Input";
import InputWithToggle from "../../utils/InputWithToggle";
import SearchSelectInput from "../../utils/SearchSelectInput";
import { options } from "../groups/eventOptions.ts";

type GroupFormProps = {
  onSuccess?: () => void;
  /** When provided, the form works in edit mode and pre-populates with the group data */
  groupId?: number;
  formData: any;
  errors: any;
  isEdit: boolean;
  handleChange: any;
  checked: boolean;
  setChecked: any;
  isAdmin: boolean;
};

export default function GroupForm({
  formData,
  errors,
  checked,
  setChecked,
  isEdit,
  handleChange,
  isAdmin,
}: GroupFormProps) {
  const disabled = isEdit && !isAdmin;

  return (
    <div className="flex flex-col w-full py-4 md:h-100 md:my-5">
      <div className="flex flex-col lg:px-20 gap-4 md:flex-1 md:justify-between md:min-h-0">
        <Input
          disabled={disabled}
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Entrez le nom du groupe"
          error={errors.name}
          data-testid="name-input"
        />

        <SearchSelectInput
          disabled={disabled}
          name="event_type"
          value={formData.event_type}
          onChange={(val) =>
            handleChange({
              target: { name: "event_type", value: val },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          placeholder="Quel est l'événement ?"
          error={errors.event_type}
          options={options}
          theme="light"
          data-testid="event-type-select"
        />

        <Input
          disabled={disabled}
          name="piggy_bank"
          type="number"
          value={String(formData.piggy_bank)}
          onChange={handleChange}
          placeholder={String(0)}
          error={errors.piggy_bank}
          data-testid="piggy-bank-input"
        />

        <InputWithToggle
          disabled={disabled}
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
          data-testid="toggle-beneficiary-input"
        />

        <Input
          disabled={disabled}
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          error={errors.deadline}
          data-testid="deadline-input"
        />
      </div>
    </div>
  );
}
