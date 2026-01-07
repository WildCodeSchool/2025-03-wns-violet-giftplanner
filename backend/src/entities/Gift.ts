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
import { Like } from "./Like";
import { List } from "./List";
import User from "./User";

@Entity()
@ObjectType()
export class Gift extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  imageUrl: string;

  @Column()
  @Field()
  url: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

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

  // joiture many
  @OneToMany(
    () => Like,
    (likes) => likes.group,
  )
  @Field(() => [Like])
  likes: Like[];

  // joiture id
  @ManyToOne(
    () => List,
    (list) => list.gift,
    { onDelete: "CASCADE", nullable: true },
  )
  @Field(() => List, { nullable: true })
  list?: List | null;

  @ManyToOne(
    () => User,
    (user) => user.gifts,
    { onDelete: "CASCADE", nullable: true },
  )
  @Field(() => User, { nullable: true })
  user?: User | null;
}
