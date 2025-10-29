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
import { GroupMembers } from "./GroupMembers";
import { Likes } from "./Likes";
import { Lists } from "./Lists";
import { Messages } from "./Messages";
import Users from "./Users";

@Entity()
@ObjectType()
export class Groups extends BaseEntity {
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
    () => Likes,
    (likes) => likes.group,
  )
  @Field(() => [Likes])
  likes: Likes[];

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
    () => Lists,
    (list_group) => list_group.groups,
  )
  @Field(() => Lists)
  list_group: Lists;

  @OneToMany(
    () => GroupMembers,
    (groupMember) => groupMember.group,
  )
  @Field(() => [GroupMembers])
  groupMember: GroupMembers[];

  @OneToMany(
    () => Messages,
    (messages) => messages.group,
  )
  @Field(() => [Messages])
  messages: Messages[];
}
