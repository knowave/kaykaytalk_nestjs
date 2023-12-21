import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { authorization } = req.headers;

    if (authorization === undefined) throw new BadRequestException();

    const refreshToken = authorization.replace('Bearer ', '');
    const refreshTokenValidate = await this.validate(refreshToken);

    req.user = refreshTokenValidate;
    return true;
  }

  async validate(refreshToken: string) {
    try {
      const bytes = CryptoJS.AES.decrypt(
        refreshToken,
        this.configService.get('AES_KEY'),
      );
      const token = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      const tokenVerify = await this.authService.tokenValidate(token);
      const user = await this.userService.getUserById(tokenVerify.id);

      if (user.refreshToken === refreshToken) {
        return user;
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      switch (error.message) {
        case 'invalid token':
          throw new BadRequestException();
        case 'no permission':
          throw new BadRequestException();
        case 'jwt expired':
          throw new BadRequestException();

        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
