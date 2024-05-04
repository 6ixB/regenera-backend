import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from '@prisma/client';
import { UserEntity } from './user.entity';
import { Exclude } from 'class-transformer';

export class UserProfileEntity implements UserProfile {
  constructor({ user, ...data }: Partial<UserProfileEntity>) {
    Object.assign(this, data);

    if (user) {
      this.user = new UserEntity(user);
    }
  }

  @Exclude()
  id: string;

  @ApiProperty({ required: false, nullable: true })
  bio: string;

  @ApiProperty({ required: false, nullable: true })
  birthDate: Date;

  @Exclude()
  userId: string;

  @ApiProperty({ required: false, type: UserEntity })
  user?: UserEntity;
}
