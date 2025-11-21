import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import Group from "../entities/Group";
import { GroupMember } from "../entities/GroupMember";
import { Message } from "../entities/Message";
import User from "../entities/User";
import { RoleMiddleware } from "../middleware/RoleMiddleware";
import type { ContextType } from "../types/context";

@InputType()
class NewMessageInput {
    @Field()
    groupId!: number;

    @Field()
    message!: string;
}

@Resolver(Group)
export default class MessageResolver {
    @UseMiddleware(RoleMiddleware())
    // pour récupérer les anciens messages d'un groupe
    @Query(() => String)
    async fetchMessagesByGroup(@Ctx() ctx: ContextType) {
        const userId = ctx.user?.id;

        if (!userId) throw new Error("Utilisateur non authentifié");

        // const group = await GroupMember.findOne({ where: { user: { id: userId }, group: { id: data.groupId } } });
        // // verifier que l'utilisateur fait bien partie du groupe
        // if (!group) throw new Error("Groupe non trouvé");

        return "ok";
    }

    @UseMiddleware(RoleMiddleware())
    // envoyer un nouveaux message
    @Mutation(() => Boolean)
    async sendMessage(@Ctx() ctx: ContextType, @Arg("data") data: NewMessageInput) {
        const userId = ctx.user?.id;

        if (!userId) throw new Error("Utilisateur non authentifié");

        const group = await GroupMember.findOne({ where: { user: { id: userId }, group: { id: data.groupId } } });
        // verifier que l'utilisateur fait bien partie du groupe
        if (!group) throw new Error("Groupe non trouvé");

        Message.create({
            group: { id: data.groupId },
            user: { id: userId },
            content: data.message,
        }).save();

        return true;
    }
}