import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: number) {
    return this.userService.getUserById(userId);
  }

  @Patch()
  updateUser(@Body() updateUserDto: UpdateUserDto, user: User) {
    return this.userService.updateUser(updateUserDto, user);
  }
}
