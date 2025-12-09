import type { NonEmptyArray } from "type-graphql";
import GroupResolver from "./resolvers/GroupResolver";
import UserResolver from "./resolvers/UserResolver";
import Welcome from "./resolvers/welcome";
import WishlistResolver from "./resolvers/wishlistResolver";
import MessageResolver from "./resolvers/MessageResolver";
import InvitationResolver from "./resolvers/InvitationResolver";

const resolverArray = [Welcome, UserResolver, WishlistResolver, GroupResolver, MessageResolver, InvitationResolver ] as NonEmptyArray<Function>;

export default resolverArray;
