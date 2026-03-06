import { GroupMember } from "../entities/GroupMember";
import { PendingInvitation } from "../entities/PendingInvitation";
import User from "../entities/User";

type AddMembersInput = {
  userEmails: string[];
  groupId: number;
};

type RemoveMembersInput = {
  userIds: number[];
  groupId: number;
};

/**
 * Add users to a group from a list of emails.
 * - Add emails to a pending invitation list if they do not exist in the db.
 */
export async function addMembersToGroup({ userEmails, groupId }: AddMembersInput) {
  if (!userEmails.length) return;

  await Promise.all(
    userEmails.map(async (userEmail) => {
      const userToAdd = await User.findOne({ where: { email: userEmail } });

      //If the user exists in the db, check if they are already a member of the group and if not, add them to the group
      if (userToAdd) {
        const existingMember = await GroupMember.findOne({
          where: { userId: userToAdd.id, groupId },
        });
        if (existingMember) return;

        const groupMember = GroupMember.create({ userId: userToAdd.id, groupId });
        await groupMember.save();
        return;
      }

      //If the user does not exist in the db, check if they are already in the pendinginvitationList and if not, add them to the pendinginvitationList
      const userPending = await PendingInvitation.findOne({
        where: { userEmail, groupId },
      });
      if (userPending) return;

      const pendingInvitation = PendingInvitation.create({ userEmail, groupId });
      await pendingInvitation.save();
    }),
  );
}

export async function removeMembersFromGroup({ userIds, groupId }: RemoveMembersInput) {
  if (!userIds || userIds.length === 0) return;

  // Remove all group members
  await Promise.all(
    userIds.map(async (userId) => {
      const groupMember = await GroupMember.findOne({
        where: { userId: userId, groupId: groupId },
      });

      if (!groupMember) return;

      try {
        await GroupMember.remove(groupMember);
      } catch (err) {
        console.error("removeMembersFromGroup error:", err);
        throw new Error("Une erreur est survenue lors de la suppression de l'utilisateur du groupe");
      }
    }),
  );
}
