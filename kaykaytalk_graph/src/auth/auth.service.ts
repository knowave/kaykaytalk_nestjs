import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createAccessToken(user: User): Promise<string> {
    const payload = {
      type: 'accessToken',
      id: user.id,
      username: user.username,
    };

    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '1h',
    });

    return accessToken;
  }

  async createRefreshToken(user: User) {
    try {
      const payload = {
        type: 'refreshToken',
        id: user.id,
        username: user.username,
      };

      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '20700m',
      });

      const tokenVerify = await this.tokenValidate(token);
      const tokenExp = new Date(tokenVerify['exp'] * 1000);

      const refreshToken = CryptoJS.AES.encrypt(
        JSON.stringify(token),
        process.env.AES_KEY,
      ).toString();

      user.refreshToken = refreshToken;
      await this.userRepository.insert(user);
      return { refreshToken, tokenExp };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async validateUser(email: string, hashedPassword: string) {
    const user = await this.userService.getUserByEmail(email);
    const password = await bcrypt.compare(hashedPassword, user.password);

    if (password) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new BadRequestException('일치하지 않는 비밀번호입니다.');
    }
  }

  async tokenValidate(token: string) {
    return await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_KEY,
    });
  }

  async reissueRefreshToken(user: User) {
    try {
      const existUser = await this.userRepository.getUserById(user.id);

      if (existUser) throw new NotFoundException();

      const payload = {
        type: 'refreshToken',
        id: existUser.id,
        username: existUser.username,
      };

      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '20700m',
      });

      const tokenVerify = await this.tokenValidate(token);
      const tokenExp = new Date(tokenVerify['exp'] * 1000);
      const currentTime = new Date();
      const timeRemaining = Math.floor(
        (tokenExp.getTime() - currentTime.getTime()) / 1000 / 60 / 60,
      );

      if (timeRemaining > 10) throw new BadRequestException();

      const refreshToken = CryptoJS.AES.encrypt(
        JSON.stringify(token),
        process.env.AES_KEY,
      ).toString();

      existUser.refreshToken = refreshToken;
      await this.userRepository.insert(existUser);

      const accessToken = await this.createAccessToken(existUser);
      return {
        accessToken: accessToken,
        refreshToken: { refreshToken, tokenExp },
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async removeRefreshToken(user: User) {
    try {
      user.refreshToken = null;
      await this.userRepository.update(user);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
