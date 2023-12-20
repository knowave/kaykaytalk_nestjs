import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAccessToken(user: User): Promise<string> {
    try {
      const payload = {
        type: 'accessToken',
        id: user.id,
        username: user.username,
      };

      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1h',
      });

      return accessToken;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createRefreshToken(user: User) {
    try {
      const payload = {
        type: 'refreshToken',
        id: user.id,
        username: user.username,
      };

      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const tokenVerify = await this.tokenValidate(token);
      const tokenExp = new Date(tokenVerify['exp'] * 1000);

      const refreshToken = CryptoJS.AES.encrypt(
        JSON.stringify(token),
        this.configService.get('AES_KEY'),
      ).toString();

      user.refreshToken = refreshToken;
      await this.userRepository.save(user);
      return { refreshToken, tokenExp };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async tokenValidate(token: string) {
    return await this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
