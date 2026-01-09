import type { GetAllMessageMyGroupsQuery } from "../graphql/generated/graphql-types";

export type MessageProps = {
  text: string;
  avatar: string;
  align: "left" | "right";
};

export type WishlistItemProps = {
  id: number;
  img: string;
  title: string;
  description: string;
  price: number;
};

export type GroupProps = {
  id: number;
  title: string;
  date: string;
  participants: number;
  fund: number;
  wishlist?: WishlistItemProps[];
  messages: MessageProps[];
};

export type MessageType = Record<
  number,
  GetAllMessageMyGroupsQuery["getAllMessageMyGroups"][number]["messages"]
>;
