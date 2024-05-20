import { RegisterUserDto } from '../dto';
import { User } from '../entities';

export interface UsersServiceInterface {
  getUsers(): Promise<User[]>;

  getUser(id: number): Promise<User>;

  getUserByUsername(username: string): Promise<User>;

  registerUser({ username, email, password }: RegisterUserDto): Promise<User>;

  deleteUser(id: number): Promise<void>;

  getUsersEmail(): Promise<string[]>;

  getUsersUsername(): Promise<string[]>;
}
