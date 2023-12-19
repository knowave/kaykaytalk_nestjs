import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (authorization === undefined) throw new BadRequestException();

    const token = authorization.replace('Bearer ', '');
    const tokenValidate = await this.validate(token);
    request.user = tokenValidate.user ? tokenValidate.user : tokenValidate;
    return true;
  }

  async validate(token: string) {
    try {
      const tokenVerify = await this.authService.tokenValidate(token);
      if (tokenVerify.type === 'accessToken') {
        return await this.userService.getUserById(tokenVerify.id);
      } else {
        return tokenVerify;
      }
    } catch (error) {
      switch (error.message) {
        case 'invalid token':
          throw new BadRequestException();
        case 'invalid signature':
          throw new BadRequestException();
        case 'jwt expired':
          throw new BadRequestException();

        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
