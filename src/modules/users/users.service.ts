import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities';
import { RegisterUserDto } from './dto';
import { Blog } from '../blogs/entities/blog.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find({
      order: { id: 'ASC' },
      relations: ['blogs'],
    });
  }

  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['blogs'],
    });
  }

  async getUserByUsername(username: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username ILIKE :username', { username: username })
      .getOne();
  }

  async registerUser({
    username,
    email,
    password,
  }: RegisterUserDto): Promise<User> {
    const user: User = this.userRepository.create({
      username,
      email,
      password,
    });
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user: User = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['blogs'],
    });

    if (!user) {
      throw new NotFoundException('Resource not found');
    }

    if (user.blogs.length) {
      user.blogs.forEach((blog) => this.blogRepository.remove(blog));
    }

    this.userRepository.remove(user);
  }

  async getUsersEmail(): Promise<User[]> {
    return await this.userRepository.find({ select: { email: true } });
  }

  async getUsersUsername(): Promise<User[]> {
    return await this.userRepository.find({ select: { username: true } });
  }
}
