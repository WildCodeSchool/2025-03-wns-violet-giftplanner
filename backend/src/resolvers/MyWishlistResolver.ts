import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Gift } from "../entities/Gift";
import List from "../entities/List";
import User from "../entities/User";
import { AddGiftInput } from "../inputs/AddGiftInput";
import { UpdateGiftInput } from "../inputs/UpdateGiftInput";
import type { ContextType } from "../types/context";
import { getOrCreateUserWishlist } from "../utils/getOrCreateUserWishlist";

@Resolver()
export default class MyWishlistResolver {
  @Query(() => [Gift])
  async myWishlistItems(@Ctx() ctx: ContextType): Promise<Gift[]> {
    if (!ctx.user) throw new Error("Utilisateur non connecté");

    const list = await getOrCreateUserWishlist(ctx.user.id);

    // fetch gifts created by the current user
    return Gift.find({
      where: { list: { id: list.id } },
      relations: { user: true, list: true },
    });
  }

  @Mutation(() => Gift)
  async addGift(@Arg("data") data: AddGiftInput, @Ctx() ctx: ContextType): Promise<Gift> {
    if (!ctx.user) throw new Error("Utilisateur non connecté");

    // Always use the connected user
    const user = await User.findOneBy({ id: ctx.user.id });
    if (!user) throw new Error("Utilisateur non trouvé");

    let list: List;
    if (data.listId) {
      const foundList = await List.findOne({
        where: { id: data.listId, user: { id: ctx.user.id } }, // ownership check
        relations: { user: true },
      });
      if (!foundList) {
        throw new Error("Liste introuvable ou ne vous appartenant pas");
      }
      list = foundList;
    } else {
      list = await getOrCreateUserWishlist(ctx.user.id);
    }

    const gift = Gift.create({
      name: data.name,
      description: data.description ?? "",
      imageUrl: data.imageUrl ?? "",
      url: data.url ?? "",
      user, // <- force owner to current user
      list: list ?? undefined,
    });

    await gift.save();
    return gift;
  }

  @Mutation(() => Gift)
  async updateGift(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: UpdateGiftInput,
    @Ctx() ctx: ContextType,
  ): Promise<Gift> {
    if (!ctx.user) throw new Error("Utilisateur non connecté");

    const gift = await Gift.findOne({ where: { id }, relations: { user: true, list: true } });
    if (!gift) throw new Error("Item non trouvé");
    if (gift.user?.id !== ctx.user.id) throw new Error("Vous n'avez pas le droit d'effectuer cette action.");

    // Patch fields if provided
    if (typeof data.name !== "undefined") gift.name = data.name;
    if (typeof data.description !== "undefined") gift.description = data.description ?? "";
    if (typeof data.imageUrl !== "undefined") gift.imageUrl = data.imageUrl ?? "";
    if (typeof data.url !== "undefined") gift.url = data.url ?? "";

    await gift.save();
    return gift;
  }

  @Mutation(() => Int)
  async deleteGift(@Arg("id", () => Int) id: number, @Ctx() ctx: ContextType): Promise<number> {
    if (!ctx.user) throw new Error("Utilisateur non connecté");

    // Always use the connected user
    const gift = await Gift.findOne({ where: { id }, relations: { user: true } });
    if (!gift) throw new Error("Item non trouvé");
    if (gift.user?.id !== ctx.user.id) throw new Error("Vous n'avez pas le droit d'effectuer cette action.");

    await gift.remove();

    return id;
  }
}
