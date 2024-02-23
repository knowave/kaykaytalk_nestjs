import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginOutput {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}
