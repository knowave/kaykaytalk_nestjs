import { Entity, Property } from '@mikro-orm/core';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/base.entity';

@InputType('userInputType')
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String)
  @Property({ columnType: 'varchar', comment: '사용자 이메일 주소' })
  email: string;

  @Field(() => String)
  @Property({ columnType: 'varchar', comment: '사용자 이름' })
  username: string;

  @Field(() => String)
  @Property({ columnType: 'varchar', comment: '사용자 비밀번호' })
  password: string;

  @Field(() => String)
  @Property({ columnType: 'varchar', comment: 'jwt refresh token' })
  refreshToken: string;
}
