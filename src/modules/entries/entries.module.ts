import { Module, forwardRef } from '@nestjs/common';
import { EntriesController } from './entries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from './entities/entry.entity';
import { Blog } from '../blogs/entities/blog.entity';
import { EntryService } from './entry.service';
import { UsersModule } from '../users/users.module';
import { BlogsModule } from '../blogs/blogs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entry, Blog]),
    UsersModule,
    forwardRef(() => BlogsModule),
  ],
  providers: [EntryService],
  controllers: [EntriesController],
  exports: [EntryService],
})
export class EntriesModule {}
