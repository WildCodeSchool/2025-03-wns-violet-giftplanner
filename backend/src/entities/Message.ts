import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Group } from "./Group";
import User from "./User";

@Entity()
@ObjectType()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  content: string;

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

  @Column({ nullable: false, default: false })
  @Field()
  isEdited: boolean;

  @ManyToOne(
    () => User,
    (user) => user.messages,
  )
  @Field(() => User)
  user: User;

  @ManyToOne(
    () => Group,
    (group) => group.messages,
    {
      onDelete: "CASCADE",
    },
  )
  @Field(() => Group)
  group: Group;
}
