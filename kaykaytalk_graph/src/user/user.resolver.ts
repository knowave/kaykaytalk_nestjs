import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { GetUserByIdOutput } from './dto/output/get-user-by-id.output';
import { GetUserByIdInput } from './dto/input/get-user-by-id.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => GetUserByIdOutput)
  async getUserById(
    @Args('input') getUserByIdInput: GetUserByIdInput,
  ): Promise<GetUserByIdOutput> {
    return this.userService.getUserById(getUserByIdInput);
  }
}
