import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(5, 20)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username must not have whitespaces, and only contain alphanumeric characters, dash and underscores',
  })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    { message: 'Email format is not legal' },
  )
  readonly email: string;

  @IsString()
  @Matches(/^(?=.*\d).*$/, { message: 'Password must have at least a number' })
  @Matches(/^(?=.*[a-z]).*$/, {
    message: 'Password must have at least a lowercase',
  })
  @Matches(/^(?=.*[A-Z]).*$/, {
    message: 'Password must have at least a uppercase',
  })
  @Matches(/^(?=.*[^\w\d\s:]).*$/, {
    message: 'Password must have at least an special char',
  })
  @Matches(/^(?!\s)(?!.*\s$)(?!.*\s\s)[^\s]+$/, {
    message: 'Password must not have whitespaced',
  })
  @Length(8, 18)
  readonly password: string;
}
