import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/modules/users/entities';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.blogs)
  creator: User;

  @CreateDateColumn()
  createdAt: Date;
}
