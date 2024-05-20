import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 18)
  readonly password: string;
}
