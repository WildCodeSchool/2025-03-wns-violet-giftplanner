import type { NonEmptyArray } from "type-graphql";
import UserResolver from "./resolvers/UserResolver";
import Welcome from "./resolvers/welcome";
import WishlistResolver from "./resolvers/wishlistResolver";
import GroupResolver from "./resolvers/GroupResolver";
const resolverArray = [Welcome, UserResolver, WishlistResolver, GroupResolver] as NonEmptyArray<Function>;

export default resolverArray;
