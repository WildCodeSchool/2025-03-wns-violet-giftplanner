import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Gifts } from "./Gifts";
import { Groups } from "./Groups";
import Users from "./Users";

@Entity()
@ObjectType()
export class Likes extends BaseEntity {
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
    () => Users,
    (user) => user.likes,
    { onDelete: "CASCADE" },
  )
  @Field(() => Users)
  user: Users;

  @ManyToOne(
    () => Groups,
    (group) => group.likes,
    { onDelete: "CASCADE" },
  )
  @Field(() => Groups)
  group: Groups;

  @ManyToOne(
    () => Gifts,
    (gift) => gift.likes,
    { onDelete: "CASCADE" },
  )
  @Field(() => Gifts)
  gift: Gifts;
}
