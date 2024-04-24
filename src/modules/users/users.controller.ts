import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities';
import { UserResponseInterceptor } from './interceptors/user-response.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(UserResponseInterceptor)
  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @UseInterceptors(UserResponseInterceptor)
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    const user: User = await this.userService.getUser(id);

    if (!user) {
      throw new NotFoundException('Resource not found');
    }

    return user;
  }
}
