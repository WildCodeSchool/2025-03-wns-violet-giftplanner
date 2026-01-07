import type { IncomingMessage, ServerResponse } from "node:http";
import { UserToken } from "./token";

export type ContextType = {
  req: IncomingMessage;
  res: ServerResponse;
  user?: UserToken;
};

export type RoleType = "USER" | "ADMIN";
