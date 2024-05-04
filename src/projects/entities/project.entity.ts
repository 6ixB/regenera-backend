import { ApiProperty } from '@nestjs/swagger';
import { Project } from '@prisma/client';

export class ProjectEntity implements Project {
  constructor(partial: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  fundingGoal: number;

  @ApiProperty()
  funding: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deadline: Date;

  @ApiProperty()
  organizerId: string;
}
