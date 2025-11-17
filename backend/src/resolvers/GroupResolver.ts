import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import Group from "../entities/Group";
import { GroupMember } from "../entities/GroupMember";

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
export default class GroupResolver {
  @Query(() => [Group])
  async getAllMyGroups() {
    const allGroups = Group.find({
      where: {
        groupMember: {
          user: { id: 8 }
        }
      },
      relations: {
        groupMember: {
          user: true,
        },
      }
    });
    //TO DO: il faudra utiliser l'id de l'utilisateur connecté pour filtrer les groupes
    return allGroups;
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
