import { Field, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/base-output.dto';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class GetUserByIdOutput extends BaseOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
