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
import { LessThan } from "typeorm";
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

  @Field()
  lastTempstampVu: Date;
}

@InputType()
class GetLazyMessagesInput {
  @Field()
  groupId: number;

  @Field()
  oldTimestamp: string;
}

@ObjectType()
class GetLazyMessagesOutput {
  @Field()
  isMaximumMessages: boolean;

  @Field(() => [Message])
  messages: Message[];
}

@InputType()
class SetLastMessageVuInput {
  @Field()
  groupId: number;
}

@ObjectType()
class SetLastMessageVuOutput {
  @Field()
  sucess: boolean;
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

    const reponse: { groupId: number; messages: Message[]; lastTempstampVu: Date }[] = [];

    // charge les 40 derniers messages de chaque groupe
    for (const group of groups) {
      const messages = await Message.find({
        where: { group: { id: group.id } },
        relations: { user: true },
        order: { createdAt: "DESC" },
        take: 40,
      });
      reponse.push({ groupId: group.id, messages, lastTempstampVu: group.groupMember[0].lastTempstampVu });
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

  @UseMiddleware(RoleMiddleware())
  @Query(() => GetLazyMessagesOutput)
  async getLazyMessages(@Arg("data") data: GetLazyMessagesInput) {
    const { groupId, oldTimestamp } = data;

    let oldDate: Date;
    try {
      oldDate = new Date(oldTimestamp);
      if (Number.isNaN(oldDate.getTime())) {
        throw new Error("Invalid date");
      }
    } catch {
      throw new Error("Invalid date format");
    }

    // récupère les 40 premiers messages plus anciens que oldTimestamp
    const messages = await Message.find({
      where: { group: { id: groupId }, createdAt: LessThan(oldDate) },
      relations: { user: true },
      order: { createdAt: "DESC" },
      take: 40,
    });

    const oldestMessage = await Message.findOne({
      where: { group: { id: groupId } },
      order: { createdAt: "ASC" },
      select: { id: true, createdAt: true },
    });

    const isMaximumMessages = oldestMessage ? messages.some((msg) => msg.id === oldestMessage.id) : true;

    // renvoie les messages et si c'est tout les messages
    return { isMaximumMessages, messages: messages };
  }

  // met a jour le vu du dernier message pour un groupe donné
  @UseMiddleware(RoleMiddleware())
  @Mutation(() => SetLastMessageVuOutput)
  async setLastMessageVu(@Arg("data") data: SetLastMessageVuInput, @Ctx() ctx: ContextType) {
    const { groupId } = data;

    const userId = ctx.user?.id;
    if (!userId) throw new Error("Utilisateur non authentifié");

    // récupère le dernier message du groupe
    const lastMessage = await Message.findOne({
      where: { group: { id: groupId } },
      order: { createdAt: "DESC" },
    });

    if (lastMessage) {
      // met a jour le vu du dernier message pour l'utilisateur
      await GroupMember.update(
        { user: { id: userId }, group: { id: groupId } },
        { lastTempstampVu: lastMessage.createdAt },
      );

      return { sucess: true };
    }

    return { sucess: false };
  }
}
