import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn
} from "typeorm";
import { Group } from "./Group";


@Entity()
@ObjectType()
export class PendingInvitation extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  @Field()
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  @Field()
  updated_at: Date;

  @Column({nullable : false, default: false})
  @Field()
  joinedGroup : boolean;

  @Column()
  @Field()
  groupId: number

  @Column()
  @Field()
  userEmail: string

  @ManyToOne(() => Group, (group)=> group.groupMember)
  @JoinColumn({name: "groupId"})
  group: Group;

}