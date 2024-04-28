import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() { username, password }: LoginUserDto) {
    return this.authService.signIn(username, password);
  }

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @UseGuards(AuthGuard)
  @Get('validate')
  validate(@Request() req) {
    return this.userService.getUser(req.user.sub);
  }
}
