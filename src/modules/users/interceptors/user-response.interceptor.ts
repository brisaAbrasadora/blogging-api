import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { User } from '../entities';

@Injectable()
export class UserResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: User | User[]) => {
        if (Array.isArray(data)) {
          return {
            users: data,
          };
        } else {
          return {
            user: data,
          };
        }
      }),
    );
  }
}
