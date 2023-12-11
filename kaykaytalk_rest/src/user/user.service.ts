import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getUserById(userId: number): Promise<User> {
    return await this.userRepository.getUserById(userId);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(createUserDto);
  }

  async updateUser(updateUserDto: UpdateUserDto, user: User): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const exist = await this.getUserById(user.id);

      exist.username = updateUserDto.username;
      exist.password = await bcrypt.hash(updateUserDto.password, 10);

      await queryRunner.manager.save(User, exist);
      await queryRunner.commitTransaction();
      return exist;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
