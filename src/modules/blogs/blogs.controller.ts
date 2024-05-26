import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  Request,
  ParseIntPipe,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { CreateBlogDto, UpdateBlogDto, filterQuery } from './dto';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';
import { BlogTitleResponseInterceptor } from './interceptors/blog-title-response.interceptor';
import { IdIsNumberGuard } from 'src/common/guards/id-is-number.guard';
import { IdIsIntegerGuard } from 'src/common/guards/id-is-integer.guard';
import { IdIsGreaterThanZeroGuard } from 'src/common/guards/id-is-greater-zero.guard';
import { BlogResponseInterceptor } from './interceptors/blog-response.interceptor';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @Get()
  getBlogs(@Query() filterQuery): Promise<Blog[]> {
    const { searchTerm, orderBy }: filterQuery = filterQuery;
    return this.blogService.getBlogs();
  }

  @UseInterceptors(BlogTitleResponseInterceptor)
  @UseGuards(IdIsGreaterThanZeroGuard)
  @Get('/titles/:id')
  async getBlogsTitlesByUser(
    @Param('id', new ParseIntPipe()) id: string,
  ): Promise<string[]> {
    const blogsTitles = await this.blogService.getBlogTitlesByUser(+id);

    return blogsTitles;
  }

  @UseInterceptors(BlogResponseInterceptor)
  @Get(':id/all')
  async getBlogsByUser(
    @Request() req,
    @Param('id') id?: number | string,
  ): Promise<Blog[]> {
    if (!isNaN(+id) && +id > 0) {
      return await this.blogService.getBlogsByUser(+id);
    } else if (id === 'me') {
      return this.blogService.getBlogsByUser(req.user.id);
    } else {
      throw new BadRequestException('ID must be a number');
    }
  }

  @UseInterceptors(BlogResponseInterceptor)
  @UseGuards(IdIsGreaterThanZeroGuard)
  @Get(':id')
  async getBlog(@Param('id', new ParseIntPipe()) id: string): Promise<Blog> {
    const blog: Blog = await this.blogService.getBlog(+id);

    if (!blog) {
      throw new NotFoundException('Resource not found');
    }

    return blog;
  }

  @Post()
  // @HttpCode(HttpStatus.NO_CONTENT) //Esto hace que no se devuelva nada
  async createBlog(@Request() req, @Body() blog: CreateBlogDto): Promise<Blog> {
    const userBlogs = await this.blogService.getBlogTitlesByUser(
      blog.creator.id,
    );

    if (userBlogs.includes(blog.title.toLowerCase())) {
      throw new ConflictException('That blog title is already in use');
    }

    return this.blogService.createBlog(blog, req.user.id);
  }

  @UseGuards(IdIsGreaterThanZeroGuard)
  @Patch(':id')
  updateBlog(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() blog: UpdateBlogDto,
  ): Promise<Blog> {
    return this.blogService.updateBlog(+id, blog);
  }

  @UseGuards(IdIsGreaterThanZeroGuard)
  @Delete(':id')
  deleteBlog(
    @Request() req,
    @Param('id', new ParseIntPipe()) id: string,
  ): Promise<void> {
    return this.blogService.deleteBlog(+id, req.user.id);
  }
}
