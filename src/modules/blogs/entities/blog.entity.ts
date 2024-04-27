import {
  Column,
  Entity,
  JoinColumn,
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

  @ManyToOne(() => User, (user) => user.blogs, { cascade: true })
  @JoinColumn({ name: 'creator_id' })
  creator: User;
}
