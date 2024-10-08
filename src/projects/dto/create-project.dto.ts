import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProjectRequirementDto } from './project-requirement.dto';

export enum ProjectPhaseEnum {
  DONATING = 'DONATING',
  VOLUNTEERING = 'VOLUNTEERING',
  PENDING = 'PENDING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
}

export class CreateProjectDto {
  @ApiProperty({ example: 'Community Park Renovation' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;

  @Type(() => String)
  @ApiProperty({
    example: 'Renovating the local park to improve community engagement.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '123 Park Lane' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @Type(() => Number)
  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsOptional()
  funding?: number;

  @Type(() => Number)
  @ApiProperty({ example: 100000 })
  @IsNumber()
  @IsNotEmpty()
  @Min(100000)
  fundingGoal: number;

  @ApiProperty({ example: '2023-12-31' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  fundingGoalDeadline: Date;

  @Type(() => Number)
  @ApiProperty({ example: 10000 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  volunteerGoal: number;

  @ApiProperty({ example: '2023-12-31' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  volunteerGoalDeadline: Date;

  @ApiProperty({ enum: ProjectPhaseEnum, enumName: 'ProjectPhase' })
  @IsOptional()
  @IsEnum(ProjectPhaseEnum, {
    message:
      'Phase must be one of: DONATING, VOLUNTEERING, PENDING, ONGOING, COMPLETED',
  })
  phase?: ProjectPhaseEnum | string;

  @Type(() => String)
  @ApiProperty({ example: 'organizer123' })
  @IsString()
  @IsNotEmpty()
  organizerId: string;

  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  objectiveImages: any;

  @IsArray()
  @ApiProperty({ type: 'string', isArray: true })
  @Type(() => String)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return value;
  })
  objectiveDescriptions: string[];

  @ApiProperty({
    type: [ProjectRequirementDto],
    example: [
      {
        requirement: 'Chairs',
        quantity: 50,
      },
      {
        requirement: 'Tables',
        quantity: 10,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectRequirementDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value).map((item: any) =>
        plainToInstance(ProjectRequirementDto, item),
      );
    }
    return value;
  })
  requirements: ProjectRequirementDto[];
}
