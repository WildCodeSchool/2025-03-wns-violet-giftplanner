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
import { Gifts } from "./Gifts";
import { GroupMembers } from "./GroupMembers";
import { Groups } from "./Groups";
import { Likes } from "./Likes";
import { Lists } from "./Lists";
import { Messages } from "./Messages";

@Entity()
@ObjectType()
class Users extends BaseEntity {
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

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  phone_number: string;

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

  @Column({ default: "lien_image_defaut" })
  @Field({ nullable: true })
  image_url: string;

  @Column({ default: false })
  @Field()
  isVerified: boolean = false;

  @Column({ default: false })
  @Field()
  isAdmin: boolean = false;

  @OneToMany(
    () => Likes,
    (likes) => likes.user,
  )
  @Field(() => [Likes])
  likes: Likes[];

  @OneToMany(
    () => Gifts,
    (gifts) => gifts.user,
  )
  @Field(() => [Gifts])
  gifts: Gifts[];

  @OneToMany(
    () => Groups,
    (group) => group.user_admin,
  )
  @Field(() => [Groups])
  admin_groups: Groups[];

  @OneToMany(
    () => Groups,
    (group) => group.user_beneficiary,
  )
  @Field(() => [Groups])
  beneficiary_groups: Groups[];

  @OneToMany(
    () => GroupMembers,
    (groupMember) => groupMember.user,
  )
  @Field(() => [GroupMembers])
  groupMember: GroupMembers[];

  @OneToMany(
    () => Messages,
    (messages) => messages.user,
  )
  @Field(() => [Messages])
  messages: Messages[];

  @ManyToMany(
    () => Lists,
    (lists) => lists.user,
  )
  @JoinTable() // seulement sur un des deux côtés
  @Field(() => [Lists])
  lists: Lists[];
}

export default Users;
