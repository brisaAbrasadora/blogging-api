import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UnprocessableEntityException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';
import { UsersService } from '../users/users.service';
import { Public } from 'src/common/decorators';
import { RegisterUserDto } from '../users/dto';
import { User } from '../users/entities';
import { PostgresErrors } from 'src/database/enum';
import { UserResponseInterceptor } from '../users/interceptors';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseInterceptors(UserResponseInterceptor)
  @Public()
  @Post('register')
  async register(@Body() user: RegisterUserDto): Promise<User> {
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

      if (
        (await this.getUsersUsernames()).includes(user.username.toLowerCase())
      ) {
        throw new ConflictException('User with that username already exists');
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
      console.log(e);
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

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  signIn(@Body() { username, password }: LoginUserDto) {
    return this.authService.signIn(username, password);
  }

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @Get('validate')
  validate(@Request() req) {
    return {
      id: req.user.id,
      username: req.user.username,
    };
  }

  private async getUsersUsernames(): Promise<string[]> {
    const users: User[] = await this.userService.getUsersUsername();

    const usernames = users.map((u: User) => u.username.toLowerCase());

    return usernames;
  }
}
