import type React from "react";
import Button from "../../utils/Button";
import Subtitle from "../../utils/Subtitle";

type GroupFormTemplateProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  left: React.ReactNode;
  right?: React.ReactNode;
  isEdit: boolean;
  submitError: any;
  errors: any;
  onSuccess: () => void;
  isAdmin: boolean;
  extraButton?: React.ReactNode;
};

export default function GroupFormTemplate({
  onSubmit,
  onSuccess,
  left,
  right,
  isEdit,
  submitError,
  errors,
  isAdmin,
  extraButton,
}: GroupFormTemplateProps) {
  return (
    <form
      className="relative flex flex-col w-full md:h-full md:min-h-0 max-md:h-auto"
      data-testid="create-group-form"
      onSubmit={(e) => {
        onSubmit(e);
      }}
      autoComplete="off"
    >
      <Subtitle className="text-center text-2xl shrink-0 my-5">
        {isEdit ? "Modifier le groupe" : "Créer un groupe"}
      </Subtitle>
      <div className="flex flex-col md:flex-row md:flex-1 md:min-h-0 md:overflow-y-auto mt-4">
        <div className="w-full md:w-1/2 flex flex-col md:flex-1 md:min-h-0 md:overflow-y-auto md:pb-14 max-md:px-4">
          {left}
        </div>

        <div className="w-full md:w-1/2 flex flex-col md:flex-1 md:min-h-0 md:pb-14 max-md:px-4">{right}</div>
      </div>

      {/* Boutons desktop : positionnés en absolu */}
      <div className="max-md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row items-center gap-5">
        <Button
          colour="dark"
          rounded
          type="button"
          onClick={onSuccess}
          className="px-4"
          data-testid="cancel-button"
        >
          Annuler
        </Button>
        {isEdit && isAdmin && (
          <Button colour="green" rounded type="submit" className="px-4" data-testid="edit-group-button">
            Modifier
          </Button>
        )}
        {!isEdit && (
          <Button
            colour="green"
            rounded
            type="submit"
            className="px-4"
            data-testid="submit-create-group-button"
          >
            Créer
          </Button>
        )}
        {extraButton}
        {submitError && <p className="text-orange font-inter text-sm pt-1 text-center">{submitError}</p>}
        {errors.main && <p className="text-orange font-inter text-sm pt-1 text-center">{errors.main}</p>}
      </div>

      {/* Boutons mobile : dans le flux, collés en bas */}
      <div className="md:hidden shrink-0 flex flex-col w-full gap-4 px-4 pt-2 pb-8">
        {isEdit && isAdmin && (
          <Button
            colour="green"
            rounded
            type="submit"
            className="w-full justify-center !rounded-[40px] shadow"
          >
            Modifier
          </Button>
        )}
        {!isEdit && (
          <Button
            colour="green"
            rounded
            type="submit"
            className="w-full justify-center !rounded-[40px] shadow"
          >
            Créer
          </Button>
        )}
        {extraButton}
        <Button
          colour="dark"
          rounded
          type="button"
          onClick={onSuccess}
          className="w-full justify-center !rounded-[40px] shadow"
        >
          Annuler
        </Button>
        {submitError && <p className="text-orange font-inter text-sm pt-1 text-center">{submitError}</p>}
        {errors.main && <p className="text-orange font-inter text-sm pt-1 text-center">{errors.main}</p>}
      </div>
    </form>
  );
}
