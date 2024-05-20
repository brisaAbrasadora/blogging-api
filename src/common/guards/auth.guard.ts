import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { env } from 'node:process';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      console.log('[AUTH GUARD] -- canActivate', new Date(), ' is Public');
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log('[AUTH GUARD] -- canActivate', new Date(), 'No token');
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: env.JWT_SECRET,
      });

      await this.usersService.getUser(payload.id);

      request['user'] = payload;
    } catch {
      console.log(
        '[AUTH GUARD] -- canActivate',
        new Date(),
        ' Token is not valid',
      );
      throw new UnauthorizedException('Token is not valid');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    console.log(
      '[AUTH GUARD] -- extractTokenFromHeader',
      new Date(),
      request.headers['authorization'],
    );
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
