import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IdIsIntegerGuard implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const id = request.url.split('/').at(-1);
    if (id.indexOf('.') >= 0) {
      throw new BadRequestException('ID must be an integer');
    }
    return true;
  }
}
