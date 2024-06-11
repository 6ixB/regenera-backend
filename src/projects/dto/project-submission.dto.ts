import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProjectSubmissionDto {
  @Type(() => String)
  @ApiProperty({ example: 'organizer123' })
  @IsString()
  @IsNotEmpty()
  objectiveId: string;

  @Type(() => String)
  @ApiProperty({ example: 'organizer123' })
  @IsString()
  @IsNotEmpty()
  submitterId: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
