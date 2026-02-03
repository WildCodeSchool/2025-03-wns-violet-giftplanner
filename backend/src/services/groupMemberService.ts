import { GroupMember } from "../entities/GroupMember";
import { PendingInvitation } from "../entities/PendingInvitation";
import User from "../entities/User";

type AddMembersInput = {
  userEmails: string[];
  groupId: number;
};

/**
 * Add users to a group from a list of emails.
 * - Silently skips emails that do not match a user.
 */
export async function addMembersToGroup({ userEmails, groupId }: AddMembersInput) {
  if (!userEmails.length) return;

  await Promise.all(
    userEmails.map(async (userEmail) => {
      const userToAdd = await User.findOne({ where: { email: userEmail } });
      const userPending = await PendingInvitation.findOne({where: {userEmail : userEmail}})
      if (!userToAdd && !userPending) {
        // if the user does not exist in the db, add it to the pendinginvitationList
        const pendingInvitation = PendingInvitation.create({
          userEmail: userEmail,
          groupId,
        });

        await pendingInvitation.save();
        return;
      }

      const groupMember = GroupMember.create({
        userId: userToAdd?.id,
        groupId,
      });

      await groupMember.save();
    }),
  );
}
