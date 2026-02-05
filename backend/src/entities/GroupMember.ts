import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Group } from "./Group";
import User from "./User";

@Entity()
@ObjectType()
@Unique(["userId", "groupId"])
export class GroupMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  userId: number;

  @Column()
  @Field()
  groupId: number;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  @Field()
  joined_at: Date;

  @Column({ default: false })
  @Field()
  isGroupAdmin: boolean;

  @Field(() => User)
  @ManyToOne(
    () => User,
    (user) => user.groupMember,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(
    () => Group,
    (group) => group.groupMember,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "groupId" })
  group: Group;
}
