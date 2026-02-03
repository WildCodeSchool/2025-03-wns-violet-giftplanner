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
      relations: { groupMember: true, user_admin: true, user_beneficiary: true },
      order: { id: "DESC" },
    });

    const payload = { groupsId: groups.map((g) => g.id) };
    const JWT_SECRET = getVariableEnv("JWT_SECRET");
    const groupToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1m" });

    return { groups, groupToken };
  }

  @FieldResolver(() => [GroupMember])
  async groupMember(@Root() group: Group) {
    const groupMembers = await GroupMember.find({
      where: { groupId: group.id },
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
}
