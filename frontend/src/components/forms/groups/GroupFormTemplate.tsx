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
}: GroupFormTemplateProps) {
  return (
    <form
      className="relative flex flex-col w-full h-full min-h-0"
      onSubmit={(e) => {
        onSubmit(e);
        onSuccess();
      }}
      autoComplete="off"
    >
      <Subtitle className="text-center text-2xl shrink-0 my-5">
        {isEdit ? "Modifier le groupe" : "Créer un groupe"}
      </Subtitle>
      <div className="flex flex-row flex-1 min-h-0">
        <div className="w-1/2 flex flex-col flex-1 min-h-0 overflow-y-auto pb-20">{left}</div>

        <div className="w-1/2 flex flex-col flex-1 min-h-0 pb-20">{right}</div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row items-center gap-5">
        <Button colour="dark" rounded type="button" onClick={onSuccess} className="px-4">
          Annuler
        </Button>
        {isEdit && isAdmin && (
          <Button colour="green" rounded type="submit" className="px-4">
            Modifier
          </Button>
        )}

        {!isEdit && (
          <Button colour="green" rounded type="submit" className="px-4">
            Créer
          </Button>
        )}

        {submitError && <p className="text-orange font-inter text-sm pt-1 text-center">{submitError}</p>}
        {errors.main && <p className="text-orange font-inter text-sm pt-1 text-center">{errors.main}</p>}
      </div>
    </form>
  );
}
