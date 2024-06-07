import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber
} from 'class-validator';

export class ProjectRequirementDto{
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    requirement: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number
}