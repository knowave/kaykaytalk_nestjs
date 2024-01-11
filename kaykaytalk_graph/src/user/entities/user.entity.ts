import { Entity, Property } from '@mikro-orm/core';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/base.entity';

@InputType('userInputType')
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String)
  @Property()
  email: string;

  @Field(() => String)
  @Property()
  username: string;

  @Field(() => String)
  @Property()
  password: string;

  @Field(() => String)
  @Property()
  refreshToken: string;
}
