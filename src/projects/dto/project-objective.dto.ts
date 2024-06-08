import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
