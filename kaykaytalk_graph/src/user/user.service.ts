import { Injectable } from '@nestjs/common';
import { GetUserByIdInput } from './dto/input/get-user-by-id.input';
import { GetUserByIdOutput } from './dto/output/get-user-by-id.output';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getUserById({ userId }: GetUserByIdInput): Promise<GetUserByIdOutput> {
    const user = await this.userRepository.getUserById(userId);

    return { ok: true, user };
  }
}
