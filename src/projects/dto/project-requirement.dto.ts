import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
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

export class ProjectRequirementArrayDto {
  @ApiProperty({ type: [ProjectRequirementDto] })
  @ValidateNested({ each: true })
  @Type(() => ProjectRequirementDto)
  requirements: ProjectRequirementDto[];
}
