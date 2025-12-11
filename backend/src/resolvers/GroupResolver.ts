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
import { Message } from "../entities/Message";
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

    const payload = { groupsId: groups.map((g) => g.id) };
    const JWT_SECRET = getVariableEnv("JWT_SECRET");
    const groupToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "50m" });

    return { groups, groupToken };
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
