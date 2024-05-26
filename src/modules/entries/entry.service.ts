import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Entry } from './entities/entry.entity';
import { CreateEntryDto } from './dto';
import { UsersService } from '../users/users.service';
import { BlogsService } from '../blogs/blogs.service';

@Injectable()
export class EntryService {
  constructor(
    private readonly userService: UsersService,
    @Inject(forwardRef(() => BlogsService))
    private readonly blogService: BlogsService,
    @InjectRepository(Entry)
    private readonly entryRepository: Repository<Entry>,
  ) {}

  async getEntry(id: number): Promise<Entry> {
    const entry: Entry = await this.entryRepository.findOne({
      select: { origin: { title: true } },
      relations: ['origin'],
      where: { id: id },
    });

    if (!entry) {
      throw new NotFoundException('Resource not found');
    }

    return entry;
  }

  async getAllEntries(): Promise<Entry[]> {
    return await this.entryRepository.find({
      select: { origin: { title: true } },
      relations: ['origin'],
    });
  }

  async getAllEntriesByBlog(id: number): Promise<Entry[]> {
    await this.blogService.getBlog(id);

    return await this.entryRepository.find({
      select: { origin: { id: true, title: true } },
      where: { origin: { id: id } },
    });
  }

  async createEntry(
    { title, body, origin }: CreateEntryDto,
    currentUser: number,
  ): Promise<Entry> {
    const currentUserBlogs = (await this.userService.getUser(currentUser))
      .blogs;
    const currentUserBlogsFiltered = currentUserBlogs.filter((b) => {
      return b.id === origin.id;
    });

    if (!currentUserBlogsFiltered.length) {
      throw new UnauthorizedException(
        'You can not create an entry for a blog that is not yours',
      );
    }

    const entry: Entry = this.entryRepository.create({
      title,
      body,
      origin,
    });

    return this.entryRepository.save(entry);
  }

  async deleteEntry(id: number): Promise<void> {
    const entry: Entry = await this.entryRepository.findOne({
      where: { id: id },
    });

    if (!entry) {
      throw new NotFoundException('Resource not found');
    }

    this.entryRepository.remove(entry);
  }

  async deleteAllEntriesByBlog(id: number): Promise<void> {
    const entries: Entry[] = await this.entryRepository.find({
      where: { origin: { id: id } },
    });

    this.entryRepository.remove(entries);
  }
}
