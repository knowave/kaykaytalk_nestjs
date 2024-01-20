import { PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseEntity {
  @Field(() => Number)
  @PrimaryKey()
  id: number;

  @Field(() => Date, { nullable: true })
  @Property({
    columnType: 'datetime',
    onCreate: () => new Date(),
    nullable: true,
  })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Property({
    columnType: 'datetime',
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Property({
    columnType: 'datetime',
    onUpdate: () => new Date(),
    nullable: true,
  })
  deletedAt: Date;
}
