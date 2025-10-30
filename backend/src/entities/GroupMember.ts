import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";
import User from "./User";

@Entity()
@ObjectType()
export class GroupMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  @Field()
  joined_at: Date;

  @ManyToOne(
    () => User,
    (user) => user.groupMember,
  )
  @Field(() => User)
  user: User;

  @ManyToOne(
    () => Group,
    (group) => group.groupMember,
  )
  @Field(() => Group)
  group: Group;
}
