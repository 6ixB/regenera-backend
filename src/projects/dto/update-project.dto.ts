import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
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
      return JSON.parse(value).map((item: any) =>
        plainToInstance(ProjectDonationDto, item),
      );
    }
    return value;
  })
  donation?: ProjectDonationDto | null;
}
