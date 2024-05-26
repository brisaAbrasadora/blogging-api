import { IsOptional, IsString } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;
}
