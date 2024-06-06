import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

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

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  organizerId: string;

  @ApiProperty({ type: [ProjectObjectiveDto] })
  @ValidateNested({ each: true })
  @Type(() => ProjectObjectiveDto)
  @IsArray()
  objectives: ProjectObjectiveDto[];

  @ApiProperty({ type: [ProjectRequirementDto] })
  @ValidateNested({ each: true })
  @Type(() => ProjectRequirementDto)
  @IsArray()
  requirements: ProjectRequirementDto[];
}
