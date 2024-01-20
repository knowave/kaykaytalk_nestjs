import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends EntityRepository<User> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager, User);
  }
  async getUserById(userId: number): Promise<User> {
    const user = await this.qb('user').where({ id: userId }).getSingleResult();

    if (!user) throw new NotFoundException('존재하는 user가 없습니다.');

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.qb('user').where({ email }).getSingleResult();

    if (user) throw new BadRequestException('이미 존재하는 이메일입니다.');

    return user;
  }
}
