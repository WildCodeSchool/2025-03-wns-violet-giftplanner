import GroupForm from "./GroupForm"
import GroupFormTemplate from "./GroupFormTemplate"
import SearchInput from "../../utils/SearchInput";
import { useEffect, useState } from "react";
import { useMyProfileStore } from "../../../zustand/myProfileStore";
import {
  type CreateGroupInput,
  type Group,
  useCreateGroupMutation,
  useGetGroupByIdQuery,
  useUpdateGroupMutation,
} from "../../../graphql/generated/graphql-types";
import { GET_ALL_MY_GROUPS } from "../../../graphql/operations/groupOperations";
import { groupCreationFormValidation, type GroupFormErrors } from "../groups/formValidationRules";
import { useSanitizedForm } from "../../../hooks/useSanitizedForm";
import { useUserPermissions } from "../../../hooks/useUserPermissions";

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
    const [checked, setChecked] = useState(false);
    const [query, setQuery] = useState("");
    const { userProfile } = useMyProfileStore();
    const [group, setGroup] = useState<Group | null>(null);
    const { currentUser, isAdmin } = useUserPermissions(group);  
    const isEditMode = !!groupId //(truthy => true or falsy => false)
    console.log('i am admin', isAdmin)
    console.log('is edit', isEditMode)

    const {
        formData,
        handleChange,
        getSanitizedData,
        errors,
        setErrors,
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
        setGroup(data?.getGroupById)
        // const group = ;
    
        setFormData((prev) => ({
          ...prev,
          name: group?.name ?? "",
          event_type: group?.event_type ?? "",
          piggy_bank: group?.piggy_bank ?? 0,
          // Normalise to YYYY-MM-DD for the date input, if possible
          deadline: group?.deadline ? new Date(group?.deadline).toISOString().slice(0, 10) : "",
          // We don't currently have an email here, so use the first name as a display value if present
          user_beneficiary: group?.user_beneficiary?.firstName ?? "",
          users: []
          
        }));
        setChecked(Boolean(group?.user_beneficiary));
      }, [data, isEditMode, setFormData, group]);
    
      if (isEditMode) {
        if (loading) return <div>Loading...</div>;
        if (queryError) return <div>Error: {queryError.message}</div>;
        if (!data?.getGroupById) return <div className="text-orange">Group not found</div>;
      }

    //Handling the users:

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    
   ; // adapt to your auth source

   const handleAddUserByEmail = (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
  
    if (!isValidEmail(normalizedEmail)) {
      setErrors((prev) => ({
        ...prev,
        users: "Adresse email invalide",
      }));
      return;
    }
  
    if (
      userProfile?.email &&
      normalizedEmail === currentUser?.email.toLowerCase()
    ) {
      setErrors((prev) => ({
        ...prev,
        users: "Vous ne pouvez pas vous ajouter vous-même",
      }));
      return;
    }
  
    if (formData.users?.includes(normalizedEmail)) {
      setErrors((prev) => ({
        ...prev,
        users: "Cet utilisateur est déjà ajouté",
      }));
      return;
    }
  
    setFormData((prev) => ({
      ...prev,
      users: [...(prev.users ?? []), normalizedEmail],
    }));
    console.log(formData.users)
  
    setErrors((prev) => {
      const { users, ...rest } = prev;
      return rest;
    });
    setQuery("");
  };
  

      

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
            users: formData.users
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
            left={(!isEditMode || (isEditMode && isAdmin)) && (<GroupForm formData={formData} errors={errors} isEdit={isEditMode} handleChange={handleChange} checked={checked} 
            setChecked={setChecked}
            submitError={submitError}
             />)}
            right={ (
              <div className="mt-8">
                <SearchInput
                    placeholder="Ajouter des participants..."
                    theme="dark"
                    name="users"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)} // ✅ correct
                    items={formData.users ?? []}
                    error={errors.users}
                    onClick={(email) => {
                        setFormData((prev) => ({
                        ...prev,
                        users: prev?.users?.filter((user) => user !== email),
                        }));
                    }}
                    onAddTag={handleAddUserByEmail}
                    />
                    {!isAdmin && isEditMode && <button>Quitter le groupe</button>}
                    {isAdmin && isEditMode && <button>Supprimer le groupe</button> }
                    </div>)

            }
            onSubmit={handleSubmit}
            isEdit={isEditMode}
            submitError={submitError}
            errors={errors}
        />

    )
}

