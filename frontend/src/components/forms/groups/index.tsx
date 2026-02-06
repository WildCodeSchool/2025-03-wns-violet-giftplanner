import { useEffect, useState } from "react";
import {
  type CreateGroupInput,
  type Group,
  useCreateGroupMutation,
  useGetGroupByIdQuery,
  useRemoveMembersFromGroupMutation,
  useUpdateGroupMutation,
} from "../../../graphql/generated/graphql-types";
import { GET_ALL_MY_GROUPS } from "../../../graphql/operations/groupOperations";
import { useSanitizedForm } from "../../../hooks/useSanitizedForm";
import { useUserPermissions } from "../../../hooks/useUserPermissions";
import { useMyProfileStore } from "../../../zustand/myProfileStore";
import { type GroupFormErrors, groupCreationFormValidation } from "../groups/formValidationRules";
import GroupForm from "./GroupForm";
import GroupFormTemplate from "./GroupFormTemplate";
import UsersForm from "./UsersForm";

type GroupFormIndex = {
  onSuccess: () => void;
  onCancel: () => void;
  groupId?: number;
  isOpen?: boolean;
};

const EMPTY_FORM_STATE: CreateGroupInput = {
  name: "",
  event_type: "",
  piggy_bank: 0,
  deadline: "",
  users: [],
  user_beneficiary: "",
};

export default function GroupFormindex({ onSuccess, groupId }: GroupFormIndex) {
  const [submitError, setSubmitError] = useState<string>("");
  const [checked, setChecked] = useState(false);
  const [query, setQuery] = useState("");
  const { userProfile } = useMyProfileStore();
  const [group, setGroup] = useState<Group | null>(null);
  const { currentUser, isAdmin } = useUserPermissions(group || undefined);
  const isEditMode = !!groupId; //(truthy => true or falsy => false)
  const [removeMembers] = useRemoveMembersFromGroupMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_ALL_MY_GROUPS,
      },
    ],
  });
  const [usersToRemove, setUsersToRemove] = useState<string[]>([]);
  const [originalMemberEmails, setOriginalMemberEmails] = useState<string[]>([]);

  const { formData, handleChange, getSanitizedData, errors, setErrors, isValid, setFormData, isEmpty } =
    useSanitizedForm<CreateGroupInput, GroupFormErrors>(EMPTY_FORM_STATE, groupCreationFormValidation);

  const {
    data,
    loading,
    error: queryError,
  } = useGetGroupByIdQuery({
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
    const groupData = data.getGroupById;
    // Set group state with proper type casting
    setGroup(groupData as Group);

    // Extract emails from existing group members (excluding the current user)
    const existingMemberEmails = groupData.groupMember
      .map((member) => member.user?.email)
      .filter((email): email is string => {
        // Filter out undefined/null emails and the current user's email
        return Boolean(email) && email.toLowerCase() !== currentUser?.email?.toLowerCase();
      });

    // Store original member emails to track removals
    setOriginalMemberEmails(existingMemberEmails);
    // Reset users to remove when group data loads
    setUsersToRemove([]);

    setFormData((prev) => ({
      ...prev,
      name: groupData?.name ?? "",
      event_type: groupData?.event_type ?? "",
      piggy_bank: groupData?.piggy_bank ?? 0,
      // Normalise to YYYY-MM-DD for the date input, if possible
      deadline: groupData?.deadline ? new Date(groupData?.deadline).toISOString().slice(0, 10) : "",
      // We don't currently have an email here, so use the first name as a display value if present
      user_beneficiary: groupData?.user_beneficiary?.firstName ?? "",
      users: existingMemberEmails,
    }));
    setChecked(Boolean(groupData?.user_beneficiary));
  }, [data, isEditMode, currentUser?.email]); //setFromData

  if (isEditMode) {
    if (loading) return <div>Loading...</div>;
    if (queryError) return <div>Error: {queryError.message}</div>;
    if (!data?.getGroupById) return <div className="text-orange">Group not found</div>;
  }

  //Handling the users:

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // adapt to your auth source

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

    if (userProfile?.email && normalizedEmail === currentUser?.email.toLowerCase()) {
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
      users: [...(prev.users || []), normalizedEmail],
    }));

    // If this user was marked for removal but is being added back, remove from removal list
    if (isEditMode && isAdmin && usersToRemove.includes(normalizedEmail)) {
      setUsersToRemove((prev) => prev.filter((e) => e !== normalizedEmail));
    }

    setErrors((prev) => {
      const { ...rest } = prev;
      return rest;
    });
    setQuery("");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");

    if (isEmpty) {
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
          users: formData.users,
        },
      };

      if (isEditMode && groupId) {
        await updateGroup({
          variables: {
            ...commonVariables,
            updateGroupId: groupId,
          },
        });

        // Remove members that were removed from the form
        if (usersToRemove.length > 0 && isAdmin) {
          await removeMembersAsAdmin();
        }

        // Reset removal tracking after successful update
        setUsersToRemove([]);
      } else {
        const response = await createGroup({
          variables: commonVariables,
        });

        console.info("Group created successfully:", response.data);

        setFormData(EMPTY_FORM_STATE);
        setChecked(false);
        setUsersToRemove([]);
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

  async function removeMembersAsAdmin() {
    if (!isAdmin || !groupId || usersToRemove.length === 0) return;
    try {
      await removeMembers({
        variables: {
          groupId: groupId,
          data: {
            userEmails: usersToRemove,
          },
        },
      });
      // Reset the users to remove list after successful removal
      setUsersToRemove([]);
    } catch (error) {
      console.error("Error removing members:", error);
      throw error; // Re-throw to be caught by handleSubmit
    }
  }

  const handleRemoveMember = (email: string) => {
    // Only track removal if this email was originally a member
    if (isEditMode && isAdmin && originalMemberEmails.includes(email)) {
      setUsersToRemove((prev) => {
        // Avoid duplicates
        if (!prev.includes(email)) {
          return [...prev, email];
        }
        return prev;
      });
    }
  };
  return (
    <GroupFormTemplate
      onSuccess={onSuccess}
      isAdmin={isAdmin}
      left={
        <GroupForm
          formData={formData}
          errors={errors}
          isEdit={isEditMode}
          handleChange={handleChange}
          checked={checked}
          setChecked={setChecked}
          onSuccess={onSuccess}
          isAdmin={isAdmin}
        />
      }
      right={
        <UsersForm
          query={query}
          setQuery={setQuery}
          items={formData.users || []}
          setFormData={setFormData}
          errors={errors}
          onAddTag={handleAddUserByEmail}
          isAdmin={isAdmin}
          isEdit={isEditMode}
          groupId={groupId || 0}
          currentUser={currentUser}
          onSuccess={onSuccess}
          onRemoveMember={handleRemoveMember}
        ></UsersForm>
      }
      onSubmit={handleSubmit}
      isEdit={isEditMode}
      submitError={submitError}
      errors={errors}
    />
  );
}
