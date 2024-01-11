import { ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/base-output.dto';

@ObjectType()
export class CreateUserOutput extends BaseOutput {}
