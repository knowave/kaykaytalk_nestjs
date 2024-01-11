import { EntityRepository } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends EntityRepository<User> {
  async getUserById(userId: number): Promise<User> {
    const user = await this.findOne({ id: userId });

    if (!user) throw new NotFoundException('존재하는 user가 없습니다.');

    return user;
  }
}
