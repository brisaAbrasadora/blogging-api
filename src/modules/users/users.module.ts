import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Blog } from '../blogs/entities/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blog])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
