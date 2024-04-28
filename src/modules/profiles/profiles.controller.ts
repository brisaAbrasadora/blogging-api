import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { User } from '../users/entities';
import { UsersService } from '../users/users.service';

@Controller('')
export class ProfilesController {
  constructor(private readonly userService: UsersService) {}

  @Get(':username')
  async getProfile(@Param('username') username: string): Promise<User> {
    const user: User = await this.userService.getUserByUsername(username);

    if (!user) {
      throw new NotFoundException('Resource not found');
    }

    return user;
  }
}
