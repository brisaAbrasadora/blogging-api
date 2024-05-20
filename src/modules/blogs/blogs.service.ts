import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Blog } from './entities/blog.entity';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { User } from '../users/entities';
import { UsersService } from '../users/users.service';
import { UsersServiceInterface } from '../users/interfaces/users-service.interface';
import { BlogsServiceInterface } from './interfaces/blogs-service.interface';

@Injectable()
export class BlogsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}

  /*  AT LEAST HAVE THIS METHODS
      ✅ Get all blogs
      ✅ Get blog by id
      ✅ Get blogs by user
      ✅ Create a blog
      ✅ Delete a blog
  */

  // TODO better authorization

  async getBlog(id: number): Promise<Blog> {
    const blog: Blog = await this.blogRepository.findOne({
      select: { creator: { id: true, username: true } },
      where: {
        id: id,
      },
      relations: ['creator'],
    });

    if (!blog) {
      throw new NotFoundException('Resource not found');
    }

    return blog;
  }

  // No need for throwing an NotFoundException since array may be empty
  async getBlogs(): Promise<Blog[]> {
    return await this.blogRepository.find({
      select: { creator: { id: true, username: true } },
      relations: ['creator'],
    });
  }

  // No need for throwing an NotFoundException since array may be empty
  async getBlogsByUser(id: number): Promise<Blog[]> {
    await this.usersService.getUser(id);

    return await this.blogRepository.find({
      select: { creator: { id: true, username: true } },
      where: { creator: { id: id } },
    });
  }

  async getBlogTitlesByUser(id: number): Promise<string[]> {
    await this.usersService.getUser(id);

    const blogs = await this.getBlogsByUser(id);

    const blogsTitles = blogs.map((b: Blog) => b.title.toLowerCase());

    return blogsTitles;
  }

  async createBlog(
    { title, description, creator }: CreateBlogDto,
    currentUserId: number,
  ): Promise<Blog> {
    await this.usersService.getUser(creator.id);

    if (+creator.id !== currentUserId) {
      throw new UnauthorizedException(
        'You can not create blogs for another user',
      );
    }

    const blog: Blog = this.blogRepository.create({
      title,
      description,
      creator,
    });
    return this.blogRepository.save(blog);
  }

  // TODO what does preload do? + review this
  async updateBlog(id: number, { title }: UpdateBlogDto): Promise<Blog> {
    const blog: Blog = await this.blogRepository.preload({
      id,
      title,
    });

    return this.blogRepository.save(blog);
  }

  async deleteAllBlogsByUser(id: number): Promise<void> {
    const blogs: Blog[] = await this.blogRepository.find({
      where: { creator: { id: id } },
    });

    this.blogRepository.remove(blogs);
  }

  async deleteBlog(id: number, currentUserId: number): Promise<void> {
    const blog: Blog = await this.blogRepository.findOne({
      select: { creator: { id: true } },
      where: {
        id: id,
      },
      relations: ['creator'],
    });

    if (blog.creator.id !== currentUserId) {
      throw new UnauthorizedException(
        'You can not delete a blog that is not yours',
      );
    }

    if (!blog) {
      throw new NotFoundException('Resource not found');
    }

    this.blogRepository.remove(blog);
  }
}
