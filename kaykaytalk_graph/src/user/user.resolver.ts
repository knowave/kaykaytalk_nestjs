import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { GetUserByIdOutput } from './dto/output/get-user-by-id.output';
import { GetUserByIdInput } from './dto/input/get-user-by-id.input';
import { CreateUserOutput } from './dto/output/create-user.output';
import { CreateUserInput } from './dto/input/create-user.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => GetUserByIdOutput)
  async getUserById(
    @Args('input') getUserByIdInput: GetUserByIdInput,
  ): Promise<GetUserByIdOutput> {
    return this.userService.getUserById(getUserByIdInput);
  }

  @Mutation(() => CreateUserOutput)
  async createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }
}
