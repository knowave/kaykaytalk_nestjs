import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseOutput {
  @Field(() => Boolean, { nullable: true })
  ok?: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}
