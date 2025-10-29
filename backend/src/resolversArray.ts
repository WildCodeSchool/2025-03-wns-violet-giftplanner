import type { NonEmptyArray } from "type-graphql";
import UserResolver from "./resolvers/UserResolver";
import Welcome from "./resolvers/Welcome";
import WishlistResolver from "./resolvers/WishlistResolver";

const resolverArray = [Welcome, UserResolver, WishlistResolver] as NonEmptyArray<Function>;

export default resolverArray;
