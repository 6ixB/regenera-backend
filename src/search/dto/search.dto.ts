import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SearchDto {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  query: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  page: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  limit: number;
}
