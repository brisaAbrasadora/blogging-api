import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { Blog } from 'src/modules/blogs/entities/blog.entity';

export class CreateEntryDto {
  @IsString()
  @Length(5, 20)
  @Matches(/^(?!\s)([A-Za-z0-9]+(\s[A-Za-z0-9]+)*)(?!\s)$/g, {
    message:
      "An entry's title can have alphanumeric characters and one space in between each character",
  })
  @IsNotEmpty()
  readonly title: string;

  // TODO dont allow spaces
  @IsString()
  @MaxLength(70)
  readonly body: string;

  @IsObject()
  @IsNotEmpty()
  readonly origin: Partial<Blog>;
  // @IsNumber()
  // readonly blogId: number;
}
