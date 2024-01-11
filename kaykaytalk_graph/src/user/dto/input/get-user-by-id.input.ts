import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetUserByIdInput {
  @Field(() => Number)
  userId: number;
}
