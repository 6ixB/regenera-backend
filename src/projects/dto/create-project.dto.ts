import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProjectObjectiveDto } from './project-objective.dto';
import { ProjectRequirementDto } from './project-requirement.dto';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  image: any;

  @Type(() => String)
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Type(() => Number)
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  fundingGoal: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  deadline: Date;

  @Type(() => String)
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  organizerId: string;

  @ApiProperty({ type: [ProjectObjectiveDto] })
  @ValidateNested({ each: true })
  @Type(() => ProjectObjectiveDto)
  @IsArray()
  @ArrayMinSize(1)
  objectives: ProjectObjectiveDto[];

  @ApiProperty({ type: [ProjectRequirementDto] })
  @ValidateNested({ each: true })
  @Type(() => ProjectRequirementDto)
  @IsArray()
  @ArrayMinSize(1)
  requirements: ProjectRequirementDto[];
}
