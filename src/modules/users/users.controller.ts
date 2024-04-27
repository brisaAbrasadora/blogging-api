import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
  UseInterceptors,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entities';
import { RegisterUserDto } from './dto';
import {
  UsernameResponseInterceptor,
  EmailResponseInterceptor,
  UserResponseInterceptor,
} from './interceptors/';
import { QueryFailedError } from 'typeorm';
import { PostgresErrors } from 'src/database/enum';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(UserResponseInterceptor)
  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @UseInterceptors(EmailResponseInterceptor)
  @Get('emails')
  async getUsersEmail(): Promise<string[]> {
    const users: User[] = await this.userService.getUsersEmail();

    const emails = users.map((u: User) => u.email.toLowerCase());

    return emails;
  }

  @UseInterceptors(UsernameResponseInterceptor)
  @Get('usernames')
  async getUsersUsernames(): Promise<string[]> {
    const users: User[] = await this.userService.getUsersUsername();

    const usernames = users.map((u: User) => u.username.toLowerCase());

    return usernames;
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

  @UseInterceptors(UserResponseInterceptor)
  @Post()
  async registerUser(@Body() user: RegisterUserDto): Promise<User> {
    try {
      const usernameFormat: RegExp = /^[a-zA-Z0-9_]+$/;
      const emailFormat: RegExp =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      const atLeastOneNumber: RegExp = /^(?=.*\d).*$/;
      const atLeastOneUppercase: RegExp = /^(?=.*[A-Z]).*$/;
      const atLeastOneLowercase: RegExp = /^(?=.*[a-z]).*$/;
      const atLeastOneSpecialChar: RegExp = /^(?=.*[^\w\d\s:]).*$/;
      const whitespaces: RegExp = /^(?!\s)(?!.*\s$)(?!.*\s\s)[^\s]+$/;

      if (!user.username.match(usernameFormat)) {
        throw new UnprocessableEntityException(
          'Username must not have whitespaces, and only contain alphanumeric characters, dash and underscores',
        );
      }
      if (!user.email.match(emailFormat)) {
        throw new UnprocessableEntityException('Email format is not legal');
      }

      if (!user.password.match(atLeastOneNumber)) {
        throw new UnprocessableEntityException(
          'Password must have at least a number',
        );
      }

      if (!user.password.match(atLeastOneLowercase)) {
        throw new UnprocessableEntityException(
          'Password must have at least a lowercase',
        );
      }

      if (!user.password.match(atLeastOneUppercase)) {
        throw new UnprocessableEntityException(
          'Password must have at least an uppercase',
        );
      }

      if (!user.password.match(atLeastOneSpecialChar)) {
        throw new UnprocessableEntityException(
          'Password must have at least an special char',
        );
      }

      if (!user.password.match(whitespaces)) {
        throw new UnprocessableEntityException(
          'Password must not have whitespaced',
        );
      }

      if (user.password.length < 8 || user.password.length > 18) {
        throw new UnprocessableEntityException(
          'Password must contain more than 7 and less than 19 characters',
        );
      }

      const hash = await bcrypt.hash(user.password, 10);

      const newUser: RegisterUserDto = {
        username: user.username,
        email: user.email.trim().toLowerCase(),
        password: hash,
      };

      return await this.userService.registerUser(newUser);
    } catch (e) {
      if (e?.code === PostgresErrors.UNIQUE_VIOLATION) {
        const detail: string = e.driverError['detail'];
        const column: string = detail.substring(
          detail.indexOf('(') + 1,
          detail.indexOf(')'),
        );
        throw new ConflictException(`${column} already exists`);
      }
      throw e;
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
