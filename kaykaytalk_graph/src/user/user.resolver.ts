import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserByIdOutput } from './dto/output/get-user-by-id.output';
import { GetUserByIdInput } from './dto/input/get-user-by-id.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => GetUserByIdOutput)
  async getUserById(
    @Args('input') getUserByIdInput: GetUserByIdInput,
  ): Promise<GetUserByIdOutput> {
    return this.userService.getUserById(getUserByIdInput);
  }
}
