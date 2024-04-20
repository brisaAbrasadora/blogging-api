import { IsObject, IsString } from 'class-validator';

import { User } from 'src/modules/users/entities';

export class CreateBlogDto {
  @IsString()
  readonly title: string;

  @IsObject()
  readonly creator: Partial<User>;
}
