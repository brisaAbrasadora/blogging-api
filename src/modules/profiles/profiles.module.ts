import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities';
import { Blog } from '../blogs/entities/blog.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User, Blog])],
  providers: [ProfilesService, UsersService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}
