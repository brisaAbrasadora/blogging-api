import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { AccessToken } from './interfaces';
import { LoginUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: LoginUserDto): Promise<AccessToken> {
    const user = await this.usersService.getUserByUsername(data.username);

    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Wrong credentials');
    }
    const payload = { id: user.id, username: user.username };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      id: user.id,
      username: user.username,
    };
  }
}
