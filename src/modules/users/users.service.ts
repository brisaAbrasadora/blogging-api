import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities';
import { RegisterUserDto } from './dto';
import { BlogsService } from '../blogs/blogs.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => BlogsService))
    private readonly blogsService: BlogsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        username: true,
        email: true,
        memberSince: true,
        updatedAt: true,
        blogs: { id: true, title: true, description: true, createdAt: true },
      },
      order: { id: 'ASC' },
      relations: ['blogs'],
    });
  }

  async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        email: true,
        memberSince: true,
        updatedAt: true,
      },
      where: {
        id: id,
      },
      relations: ['blogs'],
    });

    if (!user) {
      throw new NotFoundException('Resource not found');
    }

    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username ILIKE :username', { username: username })
      .getOne();

    if (!user) {
      throw new NotFoundException('Source not found');
    }

    return user;
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

  async deleteUser(id: number, currentUserId: string): Promise<void> {
    if (+id !== +currentUserId) {
      throw new UnauthorizedException(
        'You can not delete a user that is not yours',
      );
    }

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
      await this.blogsService.deleteAllBlogsByUser(id);
    }

    this.userRepository.remove(user);
  }

  async getUsersEmail(): Promise<string[]> {
    const users = await this.userRepository.find({ select: { email: true } });

    // Should add NotFoundException if there is any user?

    const emails = users.map((u: User) => u.email.toLowerCase());

    return emails;
  }

  async getUsersUsername(): Promise<string[]> {
    const users = await this.userRepository.find({
      select: { username: true },
    });

    // Should add NotFoundException if there is any user?

    const usernames = users.map((u: User) => u.username.toLowerCase());

    return usernames;
  }
}
