import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserProfileDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  bio?: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  birthDate?: Date;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  address?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  bannerUrl?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  instagramUrl?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  twitterUrl?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  facebookUrl?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  linkedinUrl?: string;
}
