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
import { Gift } from "./Gift";
import { Group } from "./Group";
import User from "./User";

@Entity()
@ObjectType()
export class List extends BaseEntity {
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
    () => Gift,
    (gift) => gift.list,
  )
  @Field(() => [Gift])
  gift: Gift[];

  @OneToMany(
    () => Group,
    (groups) => groups.list_group,
  )
  @Field(() => [Group])
  groups: Group[];

  @ManyToMany(
    () => User,
    (user) => user.lists,
  )
  @Field(() => [User])
  user: User[];
}

export default List;
