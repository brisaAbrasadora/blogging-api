import {
  IsNotEmpty,
  IsObject,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

import { User } from 'src/modules/users/entities';

export class CreateBlogDto {
  @IsString()
  @Length(5, 20)
  @Matches(/^(?!\s)([A-Za-z0-9]+(\s[A-Za-z0-9]+)*)(?!\s)$/g, {
    message:
      "A blog's title can have alphanumeric characters and one space in between each character",
  })
  @IsNotEmpty()
  readonly title: string;

  // TODO dont allow spaces
  @IsString()
  @MaxLength(70)
  readonly description: string;

  @IsObject()
  @IsNotEmpty()
  readonly creator: Partial<User>;
}
