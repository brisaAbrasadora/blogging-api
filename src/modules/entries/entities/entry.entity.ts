import { Blog } from 'src/modules/blogs/entities/blog.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Entry {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @PrimaryColumn()
  blogId: number;

  @ManyToOne(() => Blog)
  @JoinColumn()
  blog: Blog;
}
