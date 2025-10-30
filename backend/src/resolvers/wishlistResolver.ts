import { Query, Resolver } from "type-graphql";
import { Gift } from "../entities/Gift";

@Resolver()
export default class WishlistResolver {
  @Query(() => [Gift])
  async wishlistItems() {
    // récupère tout les cadeaux
    const allGitf = Gift.find();

    // renvoie tous les cadeaux (provisoir nouvelle logique a venir)
    return allGitf;
  }

  // @Mutation(() => ID)
  // async createWishlistItem(@Arg("data") data: AddWishlistItemInput) {
  //     const wishlistItem = WishlistItem.create({
  //
  //     })
  // }
}
