import type { NonEmptyArray } from "type-graphql";
import UserResolver from "./resolvers/UserResolver";
import Welcome from "./resolvers/welcome";

// import WishlistResolver from "./resolvers/wishlist";

const resolverIndex = [Welcome, UserResolver] as NonEmptyArray<Function>;

export default resolverIndex;
