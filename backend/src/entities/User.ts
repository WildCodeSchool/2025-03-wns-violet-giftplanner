import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Gift } from "./Gift";
import { Group } from "./Group";
import { GroupMember } from "./GroupMember";
import { Like } from "./Like";
import { List } from "./List";
import { Message } from "./Message";

@Entity()
@ObjectType()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  // ne jamais mettre de field pour pas que le mot de passe soit publiquement accessible via GraphQL
  password_hashed: string;

  @Column({ nullable: true, default: "" })
  @Field(() => String, { nullable: true })
  phone_number?: string;

  @Column()
  @Field()
  date_of_birth: string;

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

  @Column({ default: null, nullable: true })
  @Field({ nullable: true })
  image_url: string;

  @Column({ default: false })
  @Field()
  isVerified: boolean = false;

  @Column({ default: false })
  @Field()
  isAdmin: boolean = false;

  @OneToMany(
    () => Like,
    (likes) => likes.user,
  )
  @Field(() => [Like])
  likes: Like[];

  @OneToMany(
    () => Gift,
    (gifts) => gifts.user,
  )
  @Field(() => [Gift])
  gifts: Gift[];

  @OneToMany(
    () => Group,
    (group) => group.user_admin,
  )
  @Field(() => [Group])
  admin_groups: Group[];

  @OneToMany(
    () => Group,
    (group) => group.user_beneficiary,
  )
  @Field(() => [Group])
  beneficiary_groups: Group[];

  @OneToMany(
    () => GroupMember,
    (groupMember) => groupMember.user,
  )
  @Field(() => [GroupMember])
  groupMember: GroupMember[];

  @OneToMany(
    () => Message,
    (messages) => messages.user,
  )
  @Field(() => [Message])
  messages: Message[];

  @ManyToMany(
    () => List,
    (lists) => lists.user,
  )
  @JoinTable() // seulement sur un des deux côtés
  @Field(() => [List])
  lists: List[];
}

export default User;
