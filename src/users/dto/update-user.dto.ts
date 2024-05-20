import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ type: () => Number, required: false, nullable: true })
  rating?: number | null;

  @ApiProperty({ type: () => String, required: false, nullable: true })
  refreshToken?: string | null;
}
