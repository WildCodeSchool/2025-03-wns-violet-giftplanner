import type { NonEmptyArray } from "type-graphql";
import GroupResolver from "./resolvers/GroupResolver";
import UserResolver from "./resolvers/UserResolver";
import Welcome from "./resolvers/welcome";
import MessageResolver from "./resolvers/MessageResolver";
import GroupWishlistResolver from "./resolvers/GroupWishlistResolver";
import MyWishlistResolver from "./resolvers/MyWishlistResolver";

const resolverArray = [Welcome, UserResolver, MyWishlistResolver, GroupResolver, MessageResolver,
GroupWishlistResolver,
] as NonEmptyArray<Function>;

export default resolverArray;
