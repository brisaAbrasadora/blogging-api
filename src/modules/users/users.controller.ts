import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities';
import { UserResponseInterceptor } from './interceptors/user-response.interceptor';
import { RegisterUserDto } from './dto';
import { DeleteResult } from 'typeorm';

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

  @UseInterceptors(UserResponseInterceptor)
  @Post()
  registerUser(@Body() user: RegisterUserDto): Promise<User> {
    return this.userService.registerUser(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
