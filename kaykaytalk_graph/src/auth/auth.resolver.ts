import { Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from 'src/common/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { LoginOutput } from './dto/login.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => LoginOutput)
  async login(@CurrentUser() user: User): Promise<LoginOutput> {
    const accessToken = await this.authService.createAccessToken(user);
    const refreshToken = await this.authService.createRefreshToken(user);

    return { accessToken, refreshToken: refreshToken.refreshToken };
  }
}
