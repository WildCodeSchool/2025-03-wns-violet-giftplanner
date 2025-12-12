import { Query, Resolver } from "type-graphql";
import { PendingInvitation } from "../entities/PendingInvitation";

@Resolver(PendingInvitation)
export default class InvitationResolver {
  @Query(() => [PendingInvitation])
  async getAllInvitations() {
    const allInvitations = await PendingInvitation.find({
      order: { created_at: "DESC" },
    });

    return allInvitations;
  }
}
