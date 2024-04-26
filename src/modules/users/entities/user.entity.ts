import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Blog } from 'src/modules/blogs/entities/blog.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany((type) => Blog, (blog) => blog.creator)
  blogs: Blog[];

  @CreateDateColumn()
  memberSince: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
