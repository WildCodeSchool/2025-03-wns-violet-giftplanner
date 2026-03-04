export interface Gift {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
  listId?: string;
  likeCount?: number;
  likedByMe?: boolean;
  user?: {
    id: string;
  } | null;
}
