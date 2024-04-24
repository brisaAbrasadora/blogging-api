import { IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly email: string = 'test@email.com';

  @IsString()
  readonly password: string = 'password';
}
