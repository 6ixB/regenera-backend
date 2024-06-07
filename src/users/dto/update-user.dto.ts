import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransformEmptyStringToNull } from 'src/common/transformers/empty-string-to-null.transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  username?: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  email?: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  password?: string | null;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: () => Number, required: false, nullable: true })
  rating?: number | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    nullable: true,
  })
  image?: any | null;

  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  imageUrl?: string | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  refreshToken?: string | null;
}
