import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProjectRequirementDto } from './project-requirement.dto';

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
  @ApiProperty({ example: 10000 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  fundingGoal: number;

  @ApiProperty({ example: '2023-12-31' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  deadline: Date;

  @Type(() => String)
  @ApiProperty({ example: 'organizer123' })
  @IsString()
  @IsNotEmpty()
  organizerId: string;

  // @ApiProperty({
  //   type: [ProjectObjectiveDto],
  //   example: [
  //     {
  //       image: 'kakek_dewa.jpg',
  //       objective: 'walls',
  //     },
  //     {
  //       image: 'kakek_dewa.jpg',
  //       objective: 'walls',
  //     },
  //   ],
  // })
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => ProjectObjectiveDto)
  // @Transform(({ value }) => {
  //   Logger.log('objectives: ', value)
  //   if (typeof value === 'string') {
  //     return JSON.parse(value).map((item: any) =>
  //       plainToInstance(ProjectObjectiveDto, item),
  //     );
  //   }
  //   return value;
  // })
  // objectives: ProjectObjectiveDto[];

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
