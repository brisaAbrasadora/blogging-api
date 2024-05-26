import { Inject, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';
import { User } from '../users/entities';
import { Entry } from '../entries/entities/entry.entity';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { UsersServiceInterface } from '../users/interfaces/users-service.interface';
import { EntriesModule } from '../entries/entries.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, User, Entry]),
    forwardRef(() => UsersModule),
    forwardRef(() => EntriesModule),
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
