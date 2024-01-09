import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockUserService = () => ({
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
});

const mockUserRepository = () => ({
  save: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
  verify: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
        {
          provide: UserService,
          useValue: mockUserService(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    // test 끝나면 mocking 해제
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('User가 존재하고, Password가 일치한다면 성공한다.', async () => {
      const user: User = {
        id: 1,
        email: 'test@test.com',
        username: 'tester',
        password: 'test123',
        refreshToken: 'fdfdfdsljfaldksjfkdslfjljrewil',
      };

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await authService.validateUser(user.email, user.password);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(user.email);
      expect(result).toEqual(
        expect.objectContaining({
          id: user.id,
          email: user.email,
          username: user.username,
          refreshToken: user.refreshToken,
        }),
      );
    });

    it('User의 Password가 hashedPassword와 일치하지 않으면 예외처리가 발생한다.', async () => {
      try {
        const user: User = {
          id: 1,
          email: 'test@test.com',
          username: 'tester',
          password: 'test123',
          refreshToken: 'fdfdfdsljfaldksjfkdslfjljrewil',
        };

        jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

        await authService.validateUser(user.email, 'wrongPassword');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('createAccessToken', () => {
    it('User가 존재하면 AccessToken 발급에 성공한다.', async () => {
      const user: User = {
        id: 2,
        email: 'test@test.com',
        username: 'tester',
        password: 'aaa1',
      };

      jest.spyOn(jwtService, 'sign').mockReturnValue('mocking_access_token');
      jest.spyOn(configService, 'get').mockReturnValue('JWT_SECRET');

      const result = await authService.createAccessToken(user);

      expect(result).toEqual('mocking_access_token');
    });
  });

  describe('createRefreshToken', () => {
    it('User가 존재하면 RefreshToken 발급에 성공한다.', async () => {
      const user: User = {
        id: 2,
        email: 'test@test.com',
        username: 'tester',
        password: 'aaa1',
      };

      jest.spyOn(jwtService, 'sign').mockReturnValue('mocking_refresh_token');
      jest.spyOn(jwtService, 'verify').mockReturnValue({
        type: 'refreshToken',
        id: user.id,
        username: user.username,
      });
      jest.spyOn(configService, 'get').mockReturnValue('JWT_SECRET');
      jest.spyOn(configService, 'get').mockReturnValue('AES_KEY');
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await authService.createRefreshToken(user);

      console.log(result);
    });
  });
});
