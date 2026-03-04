import { Field, ID, InputType } from "type-graphql";

@InputType()
export class AddGiftInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  url?: string;

  // for gifts added by the gift recipient
  @Field(() => ID, { nullable: true })
  userId?: number;

  // so that if user adds a new item, they can select the appropriate list (needed ?)
  @Field(() => ID, { nullable: true })
  listId?: number;
}
