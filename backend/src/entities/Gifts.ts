import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Likes } from "./Likes";
import { Lists } from "./Lists";
import Users from "./Users";

@Entity()
@ObjectType()
export class Gifts {
  @PrimaryGeneratedColumn()
  @Field()
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
    () => Likes,
    (likes) => likes.group,
  )
  @Field(() => [Likes])
  likes: Likes[];

  // joiture id
  @ManyToOne(
    () => Lists,
    (list) => list.gift,
    { onDelete: "CASCADE" },
  )
  @Field(() => Lists)
  list: Lists;

  @ManyToOne(
    () => Users,
    (user) => user.gifts,
    { onDelete: "CASCADE" },
  )
  @Field(() => Users)
  user: Users;
}
