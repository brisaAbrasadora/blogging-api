import { IsString } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  readonly title: string;
}
