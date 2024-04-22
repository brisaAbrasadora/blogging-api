import { Controller, Get, UseInterceptors } from '@nestjs/common';
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

  @Get('/test')
  getUsersTest(): string {
    return 'gotcha';
  }
}
