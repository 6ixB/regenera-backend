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

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  username?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: () => String, required: false })
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsOptional()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  password?: string | null;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: () => Number, required: false, nullable: true })
  rating?: number | null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    nullable: true,
  })
  image?: any | null;
  imageUrl?: string | null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  refreshToken?: string | null;
}
