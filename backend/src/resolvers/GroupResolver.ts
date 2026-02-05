import jwt from "jsonwebtoken";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";

import Group from "../entities/Group";
import { GroupMember } from "../entities/GroupMember";
import { Message } from "../entities/Message";
import User from "../entities/User";
import { getVariableEnv } from "../lib/envManager/envManager";
import { RoleMiddleware } from "../middleware/RoleMiddleware";
import type { ContextType } from "../types/context";
import { addMembersToGroup, removeMembersFromGroup } from "../services/groupMemberService";

@InputType()
class CreateGroupInput {
  @Field()
  name!: string;

  @Field()
  event_type!: string;

  @Field()
  piggy_bank!: number;

  @Field()
  deadline!: Date;
  @Field(() => [String], { nullable: true })
  users?: string[];

  @Field({ nullable: true })
  user_beneficiary?: string;
}


@InputType()
class UpdateGroupInput {
  @Field()
  name!: string;

  @Field()
  event_type!: string;

  @Field()
  piggy_bank!: number;

  @Field()
  deadline!: Date;

  @Field(() => [String], { nullable: true })
  users?: string[];

  @Field({ nullable: true })
  user_beneficiary?: string;

}

@InputType()
class RemoveMembersInput {
  @Field(() => [Number], { nullable: true })
  userIds?: number[];

  @Field(() => [String], { nullable: true })
  userEmails?: string[];
}

@ObjectType()
export class MyGroupsResponse {
  @Field(() => [Group])
  groups!: Group[];

  @Field()
  groupToken!: string;
}

@Resolver(Group)
@UseMiddleware(RoleMiddleware())
export default class GroupResolver {
  @Query(() => MyGroupsResponse)
  async getAllMyGroups(@Ctx() ctx: ContextType) {
    if (!ctx.user) throw new Error("Utilisateur non connecté"); //TO do: changer avec le context authorized ci-dessus  @Authorized()

    //Find all the groups of the connected user
    const groups = await Group.find({
      where: {
        groupMember: {
          user: { id: ctx.user?.id },
        },
      },
      relations: { groupMember: {
        user: true, // 👈 THIS is the key
      }, user_admin: true, user_beneficiary: true },
      order: { id: "DESC" },
    });

    const payload = { groupsId: groups.map((g) => g.id) };
    const JWT_SECRET = getVariableEnv("JWT_SECRET");
    const groupToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1m" });

    return { groups, groupToken };
  }

  @Query(() => Group)
  async getGroupById(@Arg("id") id: number) {
    const group = await Group.findOne({ 
      where: { id: id },
      relations: { 
        user_admin: true, 
        user_beneficiary: true, 
        groupMember: {
          user: true,
        },
      },
     });
    if (!group) throw new Error("Groupe non trouvé");
    return group;
  }

  @FieldResolver(() => [GroupMember])
  async groupMember(@Root() group: Group) {
    const groupMembers = await GroupMember.find({
      where: { groupId: group.id },
      relations: { user: true },
    });

    return groupMembers || []; // >>> not null
  }

  @FieldResolver(() => [Message])
  async messages(@Root() group: Group) {
    const messages = await Message.find({
      where: { group: { id: group.id } },
      relations: { user: true },
      order: { createdAt: "DESC" },
      take: 20,
    });

    return messages || [];
  }

  @UseMiddleware(RoleMiddleware())
  @Mutation(() => Group)
  async createGroup(@Arg("data") data: CreateGroupInput, @Ctx() ctx: ContextType) {
    //TO DO: vérifier les inputs et les nettoyer
    if (!ctx.user) throw new Error("Utilisateur non connecté");

    //ajouter l'utilisateur créant le groupe comme admin du groupe
    let userAdmin: User;
    try {
      userAdmin = await User.findOneOrFail({ where: { id: ctx.user.id } });
    } catch {
      throw new Error("Utilisateur introuvable");
    }

    //Will need to change the logic to handle inviting the user
    let beneficiaryUser: User | null = null;
    if (data.user_beneficiary) {
      beneficiaryUser = await User.findOne({
        where: { email: data.user_beneficiary },
      });
    }

    const group = Group.create({
      user_admin: userAdmin,
      name: data.name,
      event_type: data.event_type,
      piggy_bank: data.piggy_bank,
      deadline: data.deadline,
      user_beneficiary: beneficiaryUser ?? undefined,
    });
    await group.save();

    // ajoute automatiquement le créateur comme membre du groupe
    const creatorMembership = GroupMember.create({
      userId: ctx.user.id,
      groupId: group.id,
    });
    await creatorMembership.save();

    //gérer l'ajout des utilisateurs au groupe, mapper users et les ajouter s'ils existent
    if (data.users && data.users.length > 0) {
      //à remplacer par le service add members to group
      await Promise.all(
        data.users.map(async (userEmail) => {
          const userToAdd = await User.findOne({ where: { email: userEmail } });
          if (!userToAdd) {
            return;
          }

          const groupMember = GroupMember.create({
            userId: userToAdd.id,
            groupId: group.id,
          });

          await groupMember.save();
        }),
      );
    }

    return group;
  }

  @UseMiddleware(RoleMiddleware())
  @Mutation(() => Group)
  async updateGroup(@Arg("id") id: number, @Arg("data") data: UpdateGroupInput) {
    const group = await Group.findOne({ where: { id: id } });
    if (!group) throw new Error("Groupe non trouvé");
    group.name = data.name;
    group.event_type = data.event_type;
    group.piggy_bank = data.piggy_bank;
    group.deadline = data.deadline;
    await group.save();

    if (data.users?.length) {
      await addMembersToGroup({
        userEmails: data.users,
        groupId: group.id
      });
    }
    
    return group;
  }

  @UseMiddleware(RoleMiddleware())
  @Mutation(() => String)
  async deleteGroup(
    @Arg("id") id: number,
    @Ctx() ctx: ContextType
  ): Promise<string> {
    if (!ctx.user) {
      throw new Error("Utilisateur non connecté");
    }
  
    const group = await Group.findOne({
      where: {
        id,
        user_admin: { id: ctx.user.id },
      },
      relations: { user_admin: true },
    });
    
    if (!group) {
      throw new Error("Groupe introuvable ou accès refusé");
    }
  
    if (!group.user_admin || group.user_admin.id !== ctx.user.id) {
      throw new Error(
        "Il faut être administrateur du groupe pour pouvoir le supprimer"
      );
    }
  
    try {
      await Group.remove(group);
      return "Le groupe a été supprimé";
    } catch (err) {
      console.error("deleteGroup error:", err);
      throw new Error("Une erreur est survenue lors de la suppression du groupe");
    }
  }

  @UseMiddleware(RoleMiddleware())
  @Mutation(() => String)
  async removeMembersFromGroup(
    @Arg("groupId", () => Number) groupId: number,
    @Arg("data") data: RemoveMembersInput,
    @Ctx() ctx: ContextType
  ): Promise<string> {
    if (!ctx.user) {
      throw new Error("Utilisateur non connecté");
    }

    // Ensure at least one input is provided
    if ((!data.userIds || data.userIds.length === 0) && (!data.userEmails || data.userEmails.length === 0)) {
      throw new Error("Vous devez fournir au moins un identifiant utilisateur ou un email");
    }

    const group = await Group.findOne({
      where: {
        id: groupId
      },
      relations: { user_admin: true },
    });

    if (!group) {
      throw new Error("Groupe introuvable ou accès refusé");
    }

    const currentUserId = ctx.user.id;
    const isAdmin = ctx.user.id === group.user_admin.id;

    // Convert emails to user IDs if provided
    let userIdsToRemove: number[] = [];
    
    if (data.userEmails && data.userEmails.length > 0) {
      await Promise.all(
        data.userEmails.map(async (email) => {
          const user = await User.findOne({ where: { email } });
          if (user) {
            userIdsToRemove.push(user.id);
          }
        })
      );
    }

    // Add direct user IDs if provided
    if (data.userIds && data.userIds.length > 0) {
      userIdsToRemove.push(...data.userIds);
    }

    // Remove duplicates
    userIdsToRemove = [...new Set(userIdsToRemove)];

    if (userIdsToRemove.length === 0) {
      throw new Error("Aucun utilisateur valide trouvé");
    }

    // Admin cannot remove itself from a group
    if (isAdmin && userIdsToRemove.includes(group.user_admin.id)) {
      throw new Error("L'administrateur du groupe ne peut pas être supprimé. Supprimez plutôt le groupe");
    }

    // Remove myself from a group
    if (!isAdmin && userIdsToRemove.length === 1 && userIdsToRemove[0] === currentUserId) {
      try {
        await removeMembersFromGroup({
          userIds: [currentUserId],
          groupId,
        });
        return "Succès! Vous ne faites plus partie du groupe!";
      } catch (err) {
        console.error("removeMembersFromGroup error:", err);
        throw new Error("Une erreur est survenue, nous n'avons pas pu vous supprimer du groupe");
      }
    }

    // Admin removes users from a group
    if (isAdmin && userIdsToRemove.length > 0 && !userIdsToRemove.includes(group.user_admin.id)) {
      try {
        await removeMembersFromGroup({
          userIds: userIdsToRemove,
          groupId,
        });
        return "Succès! Les utilisateurs ont été supprimés du groupe!";
      } catch (err) {
        console.error("removeMembersFromGroup error:", err);
        throw new Error("Une erreur est survenue, nous n'avons pas pu supprimer les utilisateurs du groupe");
      }
    }

    throw new Error("Vous n'avez pas les permissions nécessaires pour effectuer cette action");
  }
}
