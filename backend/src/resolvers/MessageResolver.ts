import jwt from "jsonwebtoken";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import Group from "../entities/Group";
import { GroupMember } from "../entities/GroupMember";
import { Message } from "../entities/Message";
import { getVariableEnv } from "../lib/envManager/envManager";
import { RoleMiddleware } from "../middleware/RoleMiddleware";
import type { ContextType } from "../types/context";

@InputType()
class NewMessageInput {
  @Field()
  groupId: number;

  @Field()
  message: string;

  @Field()
  userToken: string;

  @Field()
  secretServeur: string;
}

@ObjectType()
class GroupMessagesOutput {
  @Field()
  groupId: number;

  @Field(() => [Message])
  messages: Message[];
}

@Resolver(Group)
export default class MessageResolver {
  // récupère tout les message de tout les groupes de l'utilisateur connecté
  @UseMiddleware(RoleMiddleware())
  @Query(() => [GroupMessagesOutput])
  async getAllMessageMyGroups(@Ctx() ctx: ContextType) {
    // récupère tout les groupes de l'utilisateur connecté
    const groups = await Group.find({
      where: {
        groupMember: {
          user: { id: ctx.user?.id },
        },
      },
      relations: {
        groupMember: { user: true },
      },
      order: { id: "DESC" },
    });

    const reponse: { groupId: number; messages: Message[] }[] = [];

    // charge les 10 derniers messages de chaque groupe
    for (const group of groups) {
      const messages = await Message.find({
        where: { group: { id: group.id } },
        relations: { user: true },
        order: { createdAt: "DESC" },
        take: 20,
      });
      reponse.push({ groupId: group.id, messages });
    }

    return reponse;
  }

  // envoyer un nouveaux message
  @Mutation(() => Message)
  async sendMessage(@Arg("data") data: NewMessageInput) {
    const { groupId, message, secretServeur, userToken } = data;

    // verifie que la requete vient bien du serveur interne
    if (secretServeur !== getVariableEnv("INTERNAL_SECRET_KEY")) {
      throw new Error("Accès refusé");
    }

    // décode le token pour obtenir l'ID de l'utilisateur
    const token = jwt.verify(userToken, getVariableEnv("JWT_SECRET")) as { id: number };

    if (token === null || typeof token !== "object") {
      throw new Error("Token invalide");
    }

    const userId = token.id;

    if (!userId) throw new Error("Utilisateur non authentifié");

    const group = await GroupMember.findOne({ where: { userId: userId, groupId: groupId } });
    // verifier que l'utilisateur fait bien partie du groupe
    if (!group) throw new Error("Groupe non trouvé");

    const newMessage = await Message.create({
      group: { id: groupId },
      user: { id: userId },
      content: message,
    }).save();

    return await Message.findOne({
      where: { id: newMessage.id },
      relations: ["user", "group"],
    });
  }
}
