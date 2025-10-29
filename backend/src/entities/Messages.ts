import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Groups } from "./Groups";
import Users from "./Users";

@Entity()
@ObjectType()
export class Messages {
  @PrimaryGeneratedColumn()
  @Field()
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

  @Column()
  @Field()
  isEdited: boolean;

  @ManyToOne(
    () => Users,
    (user) => user.messages,
  )
  @Field(() => Users)
  user: Users;

  @ManyToOne(
    () => Groups,
    (group) => group.messages,
  )
  @Field(() => Groups)
  group: Groups;
}
