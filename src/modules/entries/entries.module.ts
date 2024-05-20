import { Module } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { EntriesController } from './entries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from './entities/entry.entity';
import { Blog } from '../blogs/entities/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entry, Blog])],
  providers: [EntriesService],
  controllers: [EntriesController],
})
export class EntriesModule {}
