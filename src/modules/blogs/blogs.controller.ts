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
} from '@nestjs/common';

import { CreateBlogDto, UpdateBlogDto, filterQuery } from './dto';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @Get()
  getBlogs(@Query() filterQuery): Promise<Blog[]> {
    const { searchTerm, orderBy }: filterQuery = filterQuery;
    return this.blogService.getBlogs();
  }

  @Get(':id')
  async getBlog(@Param('id') id: number): Promise<Blog> {
    const blog: Blog = await this.blogService.getBlog(id);

    if (!blog) {
      throw new NotFoundException('Resource not found');
    }

    return blog;
  }

  @Post()
  // @HttpCode(HttpStatus.NO_CONTENT) //Esto hace que no se devuelva nada
  createBlog(@Body() blog: CreateBlogDto): Promise<Blog> {
    return this.blogService.createBlog(blog);
  }

  @Patch(':id')
  updateBlog(
    @Param('id') id: number,
    @Body() blog: UpdateBlogDto,
  ): Promise<Blog> {
    return this.blogService.updateBlog(id, blog);
  }

  @Delete(':id')
  deleteBlog(@Param('id') id: number): Promise<void> {
    return this.blogService.deleteBlog(id);
  }
}
