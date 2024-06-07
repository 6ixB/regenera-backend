import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TransformEmptyStringToNull } from 'src/common/transformers/empty-string-to-null.transformer';

export class CreateUserProfileDto {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  bio?: string | null;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => Date, required: false, nullable: true })
  birthDate?: Date | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  address?: string | null;

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
  banner?: any | null;

  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  bannerUrl?: string | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  phone?: string | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  instagramUrl?: string | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  twitterUrl?: string | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  facebookUrl?: string | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @TransformEmptyStringToNull()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  linkedinUrl?: string | null;
}
