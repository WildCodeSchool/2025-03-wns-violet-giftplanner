import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Gifts } from "./Gifts";
import { Groups } from "./Groups";
import Users from "./Users";

@Entity()
@ObjectType()
export class Lists extends BaseEntity {
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

  @OneToMany(
    () => Gifts,
    (gift) => gift.list,
  )
  @Field(() => [Gifts])
  gift: Gifts[];

  @OneToMany(
    () => Groups,
    (groups) => groups.list_group,
  )
  @Field(() => [Groups])
  groups: Groups[];

  @ManyToMany(
    () => Users,
    (user) => user.lists,
  )
  @Field(() => [Users])
  user: Users[];
}
