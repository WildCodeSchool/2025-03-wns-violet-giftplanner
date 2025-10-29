import { Query, Resolver } from "type-graphql";
import { Gifts } from "../entities/Gifts";

@Resolver()
export default class WishlistResolver {
  @Query(() => [Gifts])
  async wishlistItems() {
    // récupère tout les cadeaux
    const allUsers = Gifts.find();

    // renvoie tous les cadeaux
    return allUsers;
  }

  // @Mutation(() => ID)
  // async createWishlistItem(@Arg("data") data: AddWishlistItemInput) {
  //     const wishlistItem = WishlistItem.create({

  //     })
  // }
}
