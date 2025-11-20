interface ModalConfig {
  isOpen: boolean;
  type: "delete" | "ban" | "unban" | null; 
  title?: string;
  message?: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  image_url?: string | null;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
}
export type { ModalConfig, User };
