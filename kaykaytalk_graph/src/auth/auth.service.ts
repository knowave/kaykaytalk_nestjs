import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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
}
