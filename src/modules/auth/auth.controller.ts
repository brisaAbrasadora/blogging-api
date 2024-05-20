import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
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

  // TODO I think the UNIQUE CONSTRAINT is not necessary here at the catch
  @UseInterceptors(UserResponseInterceptor)
  @Public()
  @Post('register')
  async register(@Body() user: RegisterUserDto): Promise<User> {
    try {
      if (
        (await this.userService.getUsersUsername()).includes(
          user.username.toLowerCase(),
        )
      ) {
        throw new ConflictException('User with that username already exists');
      }

      if (
        (await this.userService.getUsersEmail()).includes(
          user.email.toLowerCase(),
        )
      ) {
        throw new ConflictException('User with that email already exists');
      }

      const hash = await bcrypt.hash(user.password, 10);

      const newUser: RegisterUserDto = {
        username: user.username,
        email: user.email.trim().toLowerCase(),
        password: hash,
      };

      return await this.userService.registerUser(newUser);
    } catch (e) {
      console.log('[AUTH CONTROLLER] -- register', new Date(), 'error: ', e);
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
  signIn(@Body() data: LoginUserDto) {
    return this.authService.signIn(data);
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
}
