import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Gift } from "./Gift";
import { Group } from "./Group";
import User from "./User";

@Entity()
@ObjectType()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  @Field()
  createdAt: Date;

  @ManyToOne(
    () => User,
    (user) => user.likes,
    { onDelete: "CASCADE" },
  )
  @Field(() => User)
  user: User;

  @ManyToOne(
    () => Group,
    (group) => group.likes,
    { onDelete: "CASCADE" },
  )
  @Field(() => Group)
  group: Group;

  @ManyToOne(
    () => Gift,
    (gift) => gift.likes,
    { onDelete: "CASCADE" },
  )
  @Field(() => Gift)
  gift: Gift;
}
