import { CreateBlogDto, UpdateBlogDto } from '../dto';
import { Blog } from '../entities/blog.entity';

export interface BlogsServiceInterface {
  getBlog(id: number): Promise<Blog>;

  getBlogs(): Promise<Blog[]>;

  getBlogsByUser(id: number): Promise<Blog[]>;

  getBlogTitlesByUser(id: number): Promise<string[]>;

  createBlog({ title, description, creator }: CreateBlogDto): Promise<Blog>;

  updateBlog(id: number, { title }: UpdateBlogDto): Promise<Blog>;

  deleteBlog(id: number): Promise<void>;
}
