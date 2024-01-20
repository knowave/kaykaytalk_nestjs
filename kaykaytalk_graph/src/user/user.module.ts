import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  providers: [UserResolver, UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
