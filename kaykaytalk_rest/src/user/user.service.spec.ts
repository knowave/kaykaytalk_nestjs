import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { User } from './entities/user.entity';

const mockRepository = {
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
  getUserById: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let dataSource: DataSource;
  let userService: UserService;
  let userRepository: UserRepository;

  const mockQueryRunner = {
    manager: {},
  } as QueryRunner;

  class MockDataSource {
    createQueryRunner(mode?: 'master' | 'slave'): QueryRunner {
      return mockQueryRunner;
    }
  }

  beforeEach(async () => {
    Object.assign(mockQueryRunner.manager, {
      create: jest.fn(),
      save: jest.fn(),
    });

    mockQueryRunner.connect = jest.fn();
    mockQueryRunner.startTransaction = jest.fn();
    mockQueryRunner.commitTransaction = jest.fn();
    mockQueryRunner.rollbackTransaction = jest.fn();
    mockQueryRunner.release = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: DataSource, useClass: MockDataSource },
        { provide: UserRepository, useValue: mockRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  describe('GetByUserId', () => {
    const testUser: User = {
      id: 1,
      email: 'test@test.com',
      username: 'tester',
      password: 'test123',
      refreshToken: 'dklajklej234',
    };

    it('Should be find user', async () => {
      jest.spyOn(userRepository, 'getUserById').mockResolvedValue(testUser);
      const result = await userService.getUserById(testUser.id);

      expect(result).toEqual(testUser);
      expect(userRepository.getUserById).toHaveBeenCalledWith(testUser.id);
    });
  });
});
