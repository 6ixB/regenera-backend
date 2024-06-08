import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class ProjectObjectiveDto {
  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ example: 'Cleaning walls' })
  @IsString()
  @IsNotEmpty()
  objective: string;
}

export class ProjectObjectiveArrayDto {
  @ApiProperty({ type: [ProjectObjectiveDto] })
  @ValidateNested({ each: true })
  @Type(() => ProjectObjectiveDto)
  objectives: ProjectObjectiveDto[];
}
