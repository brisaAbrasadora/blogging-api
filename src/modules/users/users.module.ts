import { Inject, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Blog } from '../blogs/entities/blog.entity';
import { BlogsModule } from '../blogs/blogs.module';
import { BlogsService } from '../blogs/blogs.service';
import { BlogsServiceInterface } from '../blogs/interfaces/blogs-service.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Blog]),
    forwardRef(() => BlogsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
