import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Blog } from '../entities/blog.entity';

@Injectable()
export class BlogResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Blog | Blog[]) => {
        if (Array.isArray(data)) {
          return {
            blogs: data,
          };
        } else {
          return {
            blog: data,
          };
        }
      }),
    );
  }
}
