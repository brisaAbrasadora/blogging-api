import {
  IsNotEmpty,
  IsObject,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { User } from 'src/modules/users/entities';

export class CreateBlogDto {
  @IsString()
  @Length(5, 20)
  @Matches(/^(?!\s)([A-Za-z0-9]|\s){1,}(?!\s)$/g, {
    message:
      "A blog's title can have alphanumeric characters and spaces in between",
  })
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsObject()
  @IsNotEmpty()
  readonly creator: Partial<User>;
}
