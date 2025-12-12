import type { NonEmptyArray } from "type-graphql";
import GroupResolver from "./resolvers/GroupResolver";
import InvitationResolver from "./resolvers/InvitationResolver";
import GroupWishlistResolver from "./resolvers/GroupWishlistResolver";
import MessageResolver from "./resolvers/MessageResolver";
import MyWishlistResolver from "./resolvers/MyWishlistResolver";
import UserResolver from "./resolvers/UserResolver";
import Welcome from "./resolvers/welcome";

const resolverArray = [
  
  Welcome,
 
  UserResolver,
 
  MyWishlistResolver,
 
  GroupResolver,
 
  MessageResolver,
  GroupWishlistResolver,
,
  InvitationResolver,
] as NonEmptyArray<Function>;

export default resolverArray;
