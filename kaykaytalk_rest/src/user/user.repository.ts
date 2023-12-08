import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.findOne({ where: { id } });

      if (!user) throw new NotFoundException();

      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { email, username, password } = createUserDto;
    try {
      const exist = await this.createQueryBuilder('User')
        .where('user.email = :email', { email })
        .orWhere('user.username = :username', { username })
        .getOne();

      if (exist) throw new BadRequestException();

      const createUser = this.create({
        email,
        username,
        password: await bcrypt.hash(password, 10),
      });

      return await this.save(createUser);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
