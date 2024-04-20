import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Blog } from './entities/blog.entity';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { User } from '../users/entities';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getBlogs(): Promise<Blog[]> {
    return await this.blogRepository.find({ relations: ['creator'] });
  }

  async getBlog(id: number): Promise<Blog> {
    const blog: Blog = await this.blogRepository.findOne({
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

  async createBlog({ title, creator }: CreateBlogDto): Promise<Blog> {
    const blog: Blog = this.blogRepository.create({ title, creator });
    return this.blogRepository.save(blog);
  }

  async updateBlog(id: number, { title }: UpdateBlogDto): Promise<Blog> {
    const blog: Blog = await this.blogRepository.preload({
      id,
      title,
    });

    if (!blog) {
      throw new NotFoundException('Resource not found');
    }

    return this.blogRepository.save(blog);
  }

  async deleteBlog(id: number): Promise<void> {
    const blog: Blog = await this.blogRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!blog) {
      throw new NotFoundException('Resource not found');
    }

    this.blogRepository.remove(blog);
  }
}
