import type { NonEmptyArray } from "type-graphql";
import GroupResolver from "./resolvers/GroupResolver";
import GroupWishlistResolver from "./resolvers/GroupWishlistResolver";
import InvitationResolver from "./resolvers/InvitationResolver";
import LikeResolver from "./resolvers/LikeResolver";
import MessageResolver from "./resolvers/MessageResolver";
import MyWishlistResolver from "./resolvers/MyWishlistResolver";
import UserResolver from "./resolvers/UserResolver";
import Welcome from "./resolvers/welcome";

const resolversArray = [
  Welcome,
  UserResolver,
  MyWishlistResolver,
  GroupResolver,
  MessageResolver,
  GroupWishlistResolver,
  InvitationResolver,
  LikeResolver,
] as NonEmptyArray<Function>;

export default resolversArray;
