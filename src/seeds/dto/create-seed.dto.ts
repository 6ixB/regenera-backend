import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateSeedDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  users?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  projects?: number;
}
