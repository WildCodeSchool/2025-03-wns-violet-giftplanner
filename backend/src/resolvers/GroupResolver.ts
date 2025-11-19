import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import Group from "../entities/Group";
import { GroupMember } from "../entities/GroupMember";
import { RoleMiddleware } from "../middleware/RoleMiddleware";
import type { ContextType } from "../types/context";
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
}

@Resolver(Group)
@UseMiddleware(RoleMiddleware())
export default class GroupResolver {
  @Query(() => [Group])
  async getAllMyGroups(@Ctx() ctx: ContextType) {
    // récupère tout les groupes de l'utilisateur connecté
    const groups = await Group.find({
      where: {
        groupMember: {
          user: { id: ctx.user?.id }
        }
      },
      relations: {
        groupMember: { user: true },
      },
      order: { id: "DESC" }
    });

    // charge les 10 derniers messages de chaque groupe
    for (const group of groups) {
      group.messages = await Message.find({
        where: { group: { id: group.id } },
        relations: { user: true },
        order: { createdAt: "DESC" },
        take: 10,
      });
    }

    return groups;
  }

  @Mutation(() => Group)
  async createGroup(@Arg("data") data: CreateGroupInput) {
    //TO DO: vérifier les inputs et les nettoyer
    const group = Group.create({
      ...data,
    });

    await group.save();
    return group;
  }
}
