import { Arg, Ctx, Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import { Gift } from "../entities/Gift";
import { GroupMember } from "../entities/GroupMember";
import type { ContextType } from "../types/context";
import Group from "../entities/Group";
import List from "../entities/List";
import { getOrCreateUserWishlist } from "../utils/getOrCreateUserWishlist";

@ObjectType()
class GroupWishlistItems {
    @Field(() => [Gift])
    fromWishlist!: Gift[];

    @Field(() => [Gift])
    fromGroupList!: Gift[];
}

@Resolver()
export default class GroupWishlistResolver {
    @Query(() => GroupWishlistItems)
    async groupWishlistItems(
        @Arg("groupId", () => Int) groupId: number,
        @Ctx() ctx: ContextType,
    ): Promise<GroupWishlistItems> {
        if (!ctx.user) {
            throw new Error("Utilisateur non connecté");
        }

        // check that current user is member of this group
        const membership = await GroupMember.findOne({
            where: {
                userId: ctx.user.id,
                groupId,
            },
        });

        if (!membership) {
            throw new Error("Vous n'êtes pas membre de ce groupe.");
        }

        // load group with beneficiary + group wishlist
        const group = await Group.findOne({
            where: { id: groupId },
            relations: ["user_beneficiary", "list_group"],
        });

        if (!group) {
            throw new Error("Groupe introuvable");
        }

        // get beneficiary's wishlist using helper function
        const beneficiaryId = group.user_beneficiary.id;
        const beneficiaryWishlist: List = await getOrCreateUserWishlist(beneficiaryId);

        // fetch gifts from beneficiary's wishlist
        const fromWishlist = await Gift.find({
            where: { list: { id: beneficiaryWishlist.id } },
            relations: { user: true, list: true },
            order: { createdAt: "DESC" },
        });

        // fetch gifts from group list
        const fromGroupList = await Gift.find({
            where: { list: { id: group.list_group.id } },
            relations: { user: true, list: true },
            order: { createdAt: "DESC" },
        });

        return {
            fromWishlist,
            fromGroupList,
        };
    }
}