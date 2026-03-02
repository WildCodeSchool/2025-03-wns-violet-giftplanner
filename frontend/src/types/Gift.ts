export interface Gift {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
  listId?: string;
  user?: {
    id: string;
  } | null;
}
