import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Gift } from "../entities/Gift";
import Group from "../entities/Group";
import { GroupMember } from "../entities/GroupMember";
import type List from "../entities/List";
import { AddGiftInput } from "../inputs/AddGiftInput";
import type { ContextType } from "../types/context";
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
      relations: { user_beneficiary: true, list_group: true },
    });

    if (!group) {
      throw new Error("Groupe introuvable");
    }

    // let beneficiaryUser: User | null = null;
    // if (beneficiaryUser) {
    //   beneficiaryUser = await User.findOne({
    //     where: { email: beneficiaryUser.email },
    //   });
    // }

    // // get beneficiary's wishlist using helper function
    // const beneficiaryId = group.user_beneficiary.id;
    // const beneficiaryWishlist: List = await getOrCreateUserWishlist(beneficiaryId);

    // // fetch gifts from beneficiary's wishlist
    // const fromWishlist = await Gift.find({
    //   where: { list: { id: beneficiaryWishlist.id } },
    //   relations: { user: true, list: true },
    //   order: { createdAt: "DESC" },
    // });

    // // fetch gifts from group list
    // const fromGroupList = await Gift.find({
    //   where: { list: { id: group.list_group.id } },
    //   relations: { user: true, list: true },
    //   order: { createdAt: "DESC" },
    // });


  //Updated with chatGPT, tell me if this is ok for you Wolfgang
  let fromWishlist: Gift[] = [];

  // if the group has a beneficiary, load their wishlist + items
  if (group.user_beneficiary) {
    const beneficiaryId = group.user_beneficiary.id;

    const beneficiaryWishlist = await getOrCreateUserWishlist(beneficiaryId);

    fromWishlist = await Gift.find({
      where: { list: { id: beneficiaryWishlist.id } },
      relations: { user: true, list: true },
      order: { createdAt: "DESC" },
    });
  }

  // fetch gifts from the group list (always)
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

  @Mutation(() => Gift)
  async addGiftToGroupList(
    @Arg("groupId", () => Int) groupId: number,
    @Arg("data") data: AddGiftInput,
    @Ctx() ctx: ContextType,
  ): Promise<Gift> {
    if (!ctx.user) {
      throw new Error("Utilisateur non connecté");
    }

    // check that current user is member of this group
    const membership = await GroupMember.findOne({
      where: { userId: ctx.user.id, groupId },
    });

    if (!membership) {
      throw new Error("Vous n'êtes pas membre de ce groupe.");
    }

    // load group along with its list_group
    const group = await Group.findOne({
      where: { id: groupId },
      relations: { list_group: true },
    });

    if (!group) {
      throw new Error("Groupe introuvable");
    }

    if (!group.list_group) {
      throw new Error("Ce groupe n'a pas encore de liste associée.");
      // use utils function here ?
    }

    // create gift, ignoring any userId/listId coming from the client
    const gift = Gift.create({
      name: data.name,
      description: data.description ?? "",
      imageUrl: data.imageUrl ?? "",
      url: data.url ?? "",
      user: { id: ctx.user.id } as any,
      list: { id: group.list_group.id } as any,
    });

    await gift.save();
    return gift;
  }
}
