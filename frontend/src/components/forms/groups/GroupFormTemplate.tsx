import type React from "react";
import Button from "../../utils/Button";

type GroupFormTemplateProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  left: React.ReactNode;
  right?: React.ReactNode;
  isEdit: boolean;
  submitError:any;
  errors: any
};

export default function GroupFormTemplate({ onSubmit, left, right, isEdit, submitError, errors }: GroupFormTemplateProps) {
  return (
    <form className="relative flex w-full h-full rounded-2xl" onSubmit={onSubmit} autoComplete="off">
      <div className="bg-green w-1/2 h-full flex flex-col justify-center pt-10 pb-5 rounded-tl-2xl rounded-bl-2xl">
        {left}
      </div>

      <div className="w-1/2 bg-white h-full flex flex-col rounded-tr-2xl rounded-br-2xl">
        {right}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <Button colour="dark" rounded type="submit">{isEdit ? "Mettre à jour" : "Créer le groupe"}</Button>
        {submitError && (
          <p className="text-orange font-inter text-sm pt-1 text-center">
            {submitError}
          </p>
        )}
        {errors.main && (
          <p className="text-orange font-inter text-sm pt-1 text-center">
            {errors.main}
          </p>
        )}
      </div>
    </form>
  );
}