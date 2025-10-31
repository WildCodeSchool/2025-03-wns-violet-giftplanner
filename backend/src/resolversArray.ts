import type { NonEmptyArray } from "type-graphql";
import GroupResolver from "./resolvers/GroupResolver";
import UserResolver from "./resolvers/UserResolver";
import Welcome from "./resolvers/welcome";
import WishlistResolver from "./resolvers/wishlistResolver";

const resolverArray = [Welcome, UserResolver, WishlistResolver, GroupResolver] as NonEmptyArray<Function>;

export default resolverArray;
