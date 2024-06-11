import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProjectDonationDto } from './project-donation.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  volunteerId?: string | null;

  @ApiProperty({ type: () => ProjectDonationDto, required: false })
  @Type(() => ProjectDonationDto)
  @IsOptional()
  @ValidateNested({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const temp = JSON.parse(value);
      return plainToInstance(ProjectDonationDto, temp);
    }
    return value;
  })
  donation?: ProjectDonationDto | null;

  @ApiProperty({ type: Date, required: false })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  meetupDate?: Date;

  @IsArray()
  @ApiProperty({ type: 'string', isArray: true })
  @Type(() => String)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return value;
  })
  @IsOptional()
  submissionObjectiveIds?: string[];

  @IsArray()
  @ApiProperty({ type: 'string', isArray: true })
  @Type(() => String)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return value;
  })
  @IsOptional()
  submissionSubmitterIds?: string[];

  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  @IsOptional()
  submissionImages: any;
}
