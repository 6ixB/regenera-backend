import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { TransformEmptyStringToNull } from 'src/common/transformers/empty-string-to-null.transformer';

export class CreateUserDto {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  password?: string;
}
