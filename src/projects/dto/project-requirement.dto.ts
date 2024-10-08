import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
} from 'class-validator';

export class ProjectRequirementDto {
  @ApiProperty({ example: 'Chairs' })
  @IsString()
  @IsNotEmpty()
  requirement: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
