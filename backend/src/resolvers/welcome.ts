import { Query, Resolver } from "type-graphql";

@Resolver()
export default class Welcome {
    @Query(() => String)
    async welcomeAll() {
        return "Bienvenue dans notre API GraphQL";
    }
}