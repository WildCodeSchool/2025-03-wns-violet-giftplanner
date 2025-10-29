import type { NonEmptyArray } from "type-graphql";
import UserResolver from "./resolvers/UserResolver";
import WishlistResolver from "./resolvers/WishlistResolver";
import Welcome from "./resolvers/welcome";

const resolverIndex = [Welcome, UserResolver, WishlistResolver] as NonEmptyArray<Function>;

export default resolverIndex;
