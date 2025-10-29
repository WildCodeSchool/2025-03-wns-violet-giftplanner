import { Field, ObjectType } from "type-graphql";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Groups } from "./Groups";
import Users from "./Users";

@Entity()
@ObjectType()
export class GroupMembers {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  @Field()
  joined_at: Date;

  @ManyToOne(
    () => Users,
    (user) => user.groupMember,
  )
  @Field(() => Users)
  user: Users;

  @ManyToOne(
    () => Groups,
    (group) => group.groupMember,
  )
  @Field(() => Groups)
  group: Groups;
}
