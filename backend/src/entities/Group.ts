import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { GroupMember } from "./GroupMember";
import { Like } from "./Like";
import { List } from "./List";
import { Message } from "./Message";
import Users from "./User";

@Entity()
@ObjectType()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  @Field()
  updatedAt: Date;

  @Column()
  @Field()
  event_type: string;

  @Column()
  @Field()
  piggy_bank: number;

  @Column()
  @Field()
  deadline: Date;

  @Column()
  @Field()
  budget: number;

  @OneToMany(
    () => Like,
    (likes) => likes.group,
  )
  @Field(() => [Like])
  likes: Like[];

  @ManyToOne(
    () => Users,
    (user_admin) => user_admin.admin_groups,
  )
  @Field(() => Users)
  user_admin: Users;

  @ManyToOne(
    () => Users,
    (user_beneficiary) => user_beneficiary.beneficiary_groups,
  )
  @Field(() => Users)
  user_beneficiary: Users;

  @ManyToOne(
    () => List,
    (list_group) => list_group.groups,
  )
  @Field(() => List)
  list_group: List;

  @OneToMany(
    () => GroupMember,
    (groupMember) => groupMember.group,
  )
  @Field(() => [GroupMember])
  groupMember: GroupMember[];

  @OneToMany(
    () => Message,
    (messages) => messages.group,
  )
  @Field(() => [Message])
  messages: Message[];
}
