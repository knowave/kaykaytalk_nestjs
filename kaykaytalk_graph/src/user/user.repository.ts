import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends EntityRepository<User> {
  async getUserById(userId: number): Promise<User> {
    return await this.findOne({ id: userId });
  }
}
