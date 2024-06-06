import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ProjectObjectiveDto{
    
    @ApiProperty({type: 'string', format: 'binary'})
    @IsNotEmpty()
    image: any

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string
}