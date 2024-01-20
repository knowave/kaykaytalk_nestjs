import { Entity, Property } from '@mikro-orm/core';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/base.entity';

@InputType('userInputType')
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  password: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  refreshToken: string;
}
