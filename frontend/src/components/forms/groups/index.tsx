import GroupForm from "./GroupForm"
import GroupFormTemplate from "./GroupFormTemplate"
import UsersForm from "./UsersForm"
import { useEffect, useState } from "react";
import {
  type CreateGroupInput,
  useCreateGroupMutation,
  useGetGroupByIdQuery,
  useUpdateGroupMutation,
} from "../../../graphql/generated/graphql-types";
import { GET_ALL_MY_GROUPS } from "../../../graphql/operations/groupOperations";
import { groupCreationFormValidation, type GroupFormErrors } from "../../../hooks/formValidationRules";
import { useSanitizedForm } from "../../../hooks/useSanitizedForm";

type GroupFormIndex = {
    onSuccess?: () => void;
    groupId?: number;
}
const EMPTY_FORM_STATE: CreateGroupInput = {
    name: "",
    event_type: "",
    piggy_bank: 0,
    deadline: "",
    users: [],
    user_beneficiary: "",
  };

export default function GroupFormindex({onSuccess, groupId} : GroupFormIndex) {
    const [submitError, setSubmitError] = useState<string>("");
    const isEditMode = Boolean(groupId);
  const [checked, setChecked] = useState(false);

    const {
        formData,
        handleChange,
        getSanitizedData,
        errors,
        isValid,
        setFormData,
        isEmpty,
      } = useSanitizedForm<CreateGroupInput, GroupFormErrors>(EMPTY_FORM_STATE, groupCreationFormValidation);
    
      const { data, loading, error: queryError } = useGetGroupByIdQuery({
        variables: {
          // value will be ignored when skip is true
          id: groupId ?? 0,
        },
        skip: !isEditMode,
      });
    
      const [createGroup] = useCreateGroupMutation({
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: GET_ALL_MY_GROUPS,
          },
        ],
      });
    
      const [updateGroup] = useUpdateGroupMutation({
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: GET_ALL_MY_GROUPS,
          },
        ],
      });
    
      useEffect(() => {
        if (!isEditMode || !data?.getGroupById) return;
    
        const group = data.getGroupById;
    
        setFormData((prev) => ({
          ...prev,
          name: group.name ?? "",
          event_type: group.event_type ?? "",
          piggy_bank: group.piggy_bank ?? 0,
          // Normalise to YYYY-MM-DD for the date input, if possible
          deadline: group.deadline ? new Date(group.deadline).toISOString().slice(0, 10) : "",
          // We don't currently have an email here, so use the first name as a display value if present
          user_beneficiary: group.user_beneficiary?.firstName ?? "",
          // Keep users as-is from previous state (UI for this is not yet active)
        }));
        setChecked(Boolean(group.user_beneficiary));
      }, [data, isEditMode, setFormData]);
    
      if (isEditMode) {
        if (loading) return <div>Loading...</div>;
        if (queryError) return <div>Error: {queryError.message}</div>;
        if (!data?.getGroupById) return <div className="text-orange">Group not found</div>;
      }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitError("");
    
        if (isEmpty) {
          console.info("Form is empty.");
          setSubmitError("Être bref c'est bien, mais il faut quand même remplir le formulaire");
          return;
        }
    
        if (!isValid) {
          console.error("Form has errors, cannot submit.", errors);
          return;
        }
    
        try {
          const sanitizedData = getSanitizedData();
    
          if (!sanitizedData) {
            console.error("Sanitized data is null or undefined.");
            return;
          }
    
          const commonVariables = {
            data: {
              ...sanitizedData,
              piggy_bank: Number(sanitizedData.piggy_bank),
              deadline: new Date(sanitizedData.deadline),
            },
          };
    
          if (isEditMode && groupId) {
            await updateGroup({
              variables: {
                ...commonVariables,
                updateGroupId: groupId,
              },
            });
          } else {
            const response = await createGroup({
              variables: commonVariables,
            });
    
            console.info("Group created successfully:", response.data);
    
            setFormData(EMPTY_FORM_STATE);
            setChecked(false);
          }
    
          if (onSuccess) onSuccess();
        } catch (error: unknown) {
          console.error("Error submitting group form:", error);
          if (error instanceof Error) {
            setSubmitError(error.message);
          } else {
            setSubmitError("Une erreur est survenue");
          }
        }
      }
    return (
        <GroupFormTemplate 
            left={<GroupForm formData={formData} errors={errors} isEdit={isEditMode} handleChange={handleChange} checked={checked} 
            setChecked={setChecked}
            submitError={submitError}
             />}
            right={<UsersForm />}
            onSubmit={handleSubmit}
            isEdit={isEditMode}
            submitError={submitError}
            errors={errors}
        />

    )
}

