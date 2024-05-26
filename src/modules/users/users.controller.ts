import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  UseInterceptors,
  Request,
  BadRequestException,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities';
import {
  UsernameResponseInterceptor,
  EmailResponseInterceptor,
  UserResponseInterceptor,
} from './interceptors/';
import { Public } from 'src/common/decorators';
import { BlogsService } from '../blogs/blogs.service';
import { IdIsIntegerGuard } from 'src/common/guards/id-is-integer.guard';
import { IdIsGreaterThanZeroGuard } from 'src/common/guards/id-is-greater-zero.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly blogService: BlogsService,
  ) {}

  @UseInterceptors(UserResponseInterceptor)
  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Public()
  @UseInterceptors(EmailResponseInterceptor)
  @Get('emails')
  async getUsersEmail(): Promise<string[]> {
    return await this.userService.getUsersEmail();
  }

  @Public()
  @UseInterceptors(UsernameResponseInterceptor)
  @Get('usernames')
  async getUsersUsernames(): Promise<string[]> {
    return await this.userService.getUsersUsername();
  }

  @UseInterceptors(UserResponseInterceptor)
  @UseGuards(IdIsIntegerGuard, IdIsGreaterThanZeroGuard)
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
      return this.userService.getUser(req.user.id);
    } else {
      throw new BadRequestException('ID must be a number');
    }
  }

  @UseGuards(IdIsGreaterThanZeroGuard)
  @Delete(':id')
  async deleteUser(
    @Request() req,
    @Param('id', new ParseIntPipe()) id: string,
  ): Promise<void> {
    return this.userService.deleteUser(+id, req.user.id);
  }
}
