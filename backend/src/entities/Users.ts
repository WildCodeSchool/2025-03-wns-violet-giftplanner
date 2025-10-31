import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@ObjectType()
class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
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
}

export default Users;
