import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<AccessToken> {
    const user = await this.usersService.getUserByUsername(username);

    if (!user) {
      throw new NotFoundException('Source not found');
    }

    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Wrong credentials');
    }
    const payload = { sub: user.id, username: user.username };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      id: user.id,
      username: user.username,
    };
  }
}
