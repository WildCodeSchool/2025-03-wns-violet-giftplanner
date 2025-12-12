import List from "../entities/List";
import User from "../entities/User";

export async function getOrCreateUserWishlist(userId: number): Promise<List> {
  // load user and list(s)

  const user = await User.findOne({
    where: { id: userId },
    relations: ["lists"],
  });

  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  if (user.lists && user.lists.length > 0) {
    return user.lists[0];
  }

  const wishlist = List.create({
    name: "Ma liste de souhaits",
  });

  await wishlist.save();

  // attach list to the user (ManyToMany)
  user.lists = [...(user.lists ?? []), wishlist];
  await user.save();

  return wishlist;
}
