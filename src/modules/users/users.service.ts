import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { User } from './entities';
import { UsersResponse } from './interfaces/users.response';
import { RegisterUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
    });
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
    });

    if (!user) {
      throw new NotFoundException('Resource not found');
    }

    this.userRepository.remove(user);
  }
}
