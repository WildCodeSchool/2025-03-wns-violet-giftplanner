import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateGiftInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  url?: string;
}
