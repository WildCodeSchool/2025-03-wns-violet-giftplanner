import { Arg, Ctx, FieldResolver, Int, Mutation, Resolver, Root, UseMiddleware } from "type-graphql";
import { Gift } from "../entities/Gift";
import { GroupMember } from "../entities/GroupMember";
import { Like } from "../entities/Like";
import { RoleMiddleware } from "../middleware/RoleMiddleware";
import type { ContextType } from "../types/context";

@Resolver(() => Gift)
export default class LikeResolver {
  /** Nombre de likes sur ce cadeau */
  @FieldResolver(() => Int)
  async likeCount(@Root() gift: Gift): Promise<number> {
    return Like.count({ where: { gift: { id: gift.id } } });
  }

  /** L'utilisateur connecté a-t-il liké ce cadeau ? */
  @FieldResolver(() => Boolean)
  async likedByMe(@Root() gift: Gift, @Ctx() ctx: ContextType): Promise<boolean> {
    if (!ctx.user) return false;
    const like = await Like.findOne({
      where: { gift: { id: gift.id }, user: { id: ctx.user.id } },
    });
    return !!like;
  }

  /** Toggle like / unlike sur un cadeau dans le contexte d'un groupe */
  @Mutation(() => Boolean)
  @UseMiddleware(RoleMiddleware())
  async toggleGiftLike(
    @Arg("giftId", () => Int) giftId: number,
    @Arg("groupId", () => Int) groupId: number,
    @Ctx() ctx: ContextType,
  ): Promise<boolean> {
    if (!ctx.user) throw new Error("Non connecté");

    const membership = await GroupMember.findOne({
      where: { userId: ctx.user.id, groupId },
    });
    if (!membership) throw new Error("Pas membre du groupe");

    const existing = await Like.findOne({
      where: {
        gift: { id: giftId },
        user: { id: ctx.user.id },
        group: { id: groupId },
      },
    });

    if (existing) {
      await existing.remove();
      return false; // unliked
    }

    const like = Like.create({
      gift: { id: giftId } as any,
      user: { id: ctx.user.id } as any,
      group: { id: groupId } as any,
    });
    await like.save();
    return true; // liked
  }
}
