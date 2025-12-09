import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware, FieldResolver, Root } from "type-graphql";
import Group from "../entities/Group";
import { GroupMember } from "../entities/GroupMember";
import { RoleMiddleware } from "../middleware/RoleMiddleware";
import type { ContextType } from "../types/context";
import User from "../entities/User";
import { Message } from "../entities/Message";

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
}

@Resolver(Group)
@UseMiddleware(RoleMiddleware())
export default class GroupResolver {
  @Query(() => [Group])
  async getAllMyGroups(@Ctx() ctx: ContextType) {
    if (!ctx.user) throw new Error("Utilisateur non connecté");

    //Find all the groups of the connected user
    const groups = await Group.find({
      where: { groupMember: { user: { id: ctx.user.id } } },
      relations: { groupMember: { user: true } },
      order: { id: "DESC" },
    });


    return groups;
  }

  @FieldResolver(() => [GroupMember])
  async groupMember(@Root() group: Group) {
    const groupMembers = await GroupMember.find({
      where: { groupId: group.id }
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

  @Mutation(() => Group)
  async createGroup(@Arg("data") data: CreateGroupInput, @Ctx() ctx: ContextType) {

    //TO DO: vérifier les inputs et les nettoyer
    if (!ctx.user) throw new Error("Utilisateur non connecté");

    //TO DO: ajouter l'utilisateur créant le groupe comme admin du groupe
    let userAdmin;
    try {
      userAdmin = await User.findOneOrFail({ where: { id: ctx.user.id } });
    } catch {
      throw new Error("Utilisateur introuvable");
    }

    
 
    const group = Group.create({
      user_admin: userAdmin,
      name: data.name,
      event_type: data.event_type,
      piggy_bank: data.piggy_bank,
      deadline: data.deadline,
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
      await Promise.all(
        data.users.map(async (userEmail) => {
          const userToAdd = await User.findOne({ where: { email: userEmail } });
          if (!userToAdd) {
            console.log("Cet utilisateur n'existe pas encore chez nous!");
            return;
          }

          const groupMember = GroupMember.create({
            userId: userToAdd.id,
            groupId: group.id,
          });

          await groupMember.save();
        })
      );
    }

    return group;
  }
}
