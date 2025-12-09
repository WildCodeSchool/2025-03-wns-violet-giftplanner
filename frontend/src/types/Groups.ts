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
