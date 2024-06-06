import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserProfileDto {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  bio?: string | null;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: () => Date, required: false, nullable: true })
  birthDate?: Date | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  address?: string | null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    nullable: true,
  })
  banner?: any | null;
  bannerUrl?: string | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  phone?: string | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  instagramUrl?: string | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  twitterUrl?: string | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  facebookUrl?: string | null;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: () => String, required: false, nullable: true })
  linkedinUrl?: string | null;
}
