import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  UseInterceptors,
  Request,
  BadRequestException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities';
import {
  UsernameResponseInterceptor,
  EmailResponseInterceptor,
  UserResponseInterceptor,
} from './interceptors/';
import { Public } from 'src/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(UserResponseInterceptor)
  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Public()
  @UseInterceptors(EmailResponseInterceptor)
  @Get('emails')
  async getUsersEmail(): Promise<string[]> {
    const users: User[] = await this.userService.getUsersEmail();

    const emails = users.map((u: User) => u.email.toLowerCase());

    return emails;
  }

  @Public()
  @UseInterceptors(UsernameResponseInterceptor)
  @Get('usernames')
  async getUsersUsernames(): Promise<string[]> {
    const users: User[] = await this.userService.getUsersUsername();

    const usernames = users.map((u: User) => u.username.toLowerCase());

    return usernames;
  }

  @UseInterceptors(UserResponseInterceptor)
  @Get(':id')
  async getUser(
    @Request() req,
    @Param('id') id?: number | string,
  ): Promise<User> {
    if (!isNaN(+id)) {
      const user: User = await this.userService.getUser(+id);

      if (!user) {
        throw new NotFoundException('Resource not found');
      }

      return user;
    } else if (id === 'me') {
      console.log('[USERS CONTROLLER] -- getUser', new Date(), 'id === me');
      return this.userService.getUser(req.user.sub);
    } else {
      throw new BadRequestException('');
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
