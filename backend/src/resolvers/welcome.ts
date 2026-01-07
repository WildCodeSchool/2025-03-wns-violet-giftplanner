import { Query, Resolver, UseMiddleware } from "type-graphql";
import { RoleMiddleware } from "../middleware/RoleMiddleware";

@Resolver()
export default class Welcome {
  @Query(() => String)
  async welcomeAll() {
    return "Bienvenue dans notre API GraphQL";
  }

  @Query(() => String)
  async coucou() {
    return "Bienvenue dans notre API GraphQL !";
  }

  @UseMiddleware(RoleMiddleware())
  @Query(() => String)
  async testUser() {
    return "Ce message s'affiche uniquement si vous êtes connecté";
  }

  @UseMiddleware(RoleMiddleware(true))
  @Query(() => String)
  async testAdmin() {
    return "Ce message s'affiche uniquement si vous êtes admin";
  }
}
