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
}
