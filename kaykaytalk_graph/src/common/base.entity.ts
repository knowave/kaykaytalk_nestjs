import { PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseEntity {
  @Field(() => Number)
  @PrimaryKey()
  id: number;

  @Field(() => Date)
  @Property({ columnType: 'datetime' })
  createdAt: Date;

  @Field(() => Date)
  @Property({ columnType: 'datetime' })
  updatedAt: Date;

  @Field(() => Date)
  @Property({ columnType: 'datetime' })
  deletedAt: Date;
}
