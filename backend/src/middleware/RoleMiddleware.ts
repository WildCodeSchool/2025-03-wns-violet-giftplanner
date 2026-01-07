import type { MiddlewareFn } from "type-graphql";
import type { ContextType } from "../types/context";

export function RoleMiddleware(adminRequed: boolean = false): MiddlewareFn<ContextType> {
  return async ({ context }, next) => {
    const user = context.user;

    // Si l'utilisateur n'est pas authentifié
    if (!user) throw new Error("Utilisateur non authentifié");

    // Si l'utilisateur n'est pas admin et que le rôle admin est requis
    if (!user.isAdmin && adminRequed) {
      throw new Error(`utilisateur non autorisé`);
    }

    // Si tout est ok, on continue
    return next();
  };
}
