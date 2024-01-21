import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetUserByIdInput } from './dto/input/get-user-by-id.input';
import { GetUserByIdOutput } from './dto/output/get-user-by-id.output';
import { UserRepository } from './user.repository';
import { EntityManager } from '@mikro-orm/mysql';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/input/create-user.input';
import { CreateUserOutput } from './dto/output/create-user.output';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/input/update-user.input';
import { UpdateUserOutput } from './dto/output/update-user.output';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly entityManager: EntityManager,
  ) {}

  async getUserById({ userId }: GetUserByIdInput): Promise<GetUserByIdOutput> {
    const user = await this.userRepository.getUserById(userId);

    return { ok: true, user };
  }

  async createUser({
    email,
    username,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    const em = this.entityManager.fork();
    await this.userRepository.getUserByEmail(email);
    try {
      await em.begin();
      const createUser = em.create(User, {
        email,
        username,
        password: await bcrypt.hash(password, 10),
      });

      em.persist(createUser);
      await em.commit();
      return { ok: true };
    } catch (err) {
      await em.rollback();
      throw new InternalServerErrorException(`Server Error: ${err.stack}`);
    }
  }

  async updateUser(
    { username, password }: UpdateUserInput,
    user: User,
  ): Promise<UpdateUserOutput> {
    const em = this.entityManager.fork();
    try {
      await em.begin();

      if (username) user.username = username;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }

      em.persist(user);
      await em.commit();
      return { ok: true };
    } catch (err) {
      await em.rollback();
      throw new InternalServerErrorException(`Server Error: ${err.stack}`);
    }
  }
}
