import { ApiProperty } from '@nestjs/swagger';
import {
  Project,
  ProjectDonation,
  ProjectObjective,
  ProjectRequirement,
} from '@prisma/client';
import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';

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
  address: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  fundingGoal: number;

  @ApiProperty()
  fundingGoalDeadline: Date;

  @ApiProperty()
  volunteerGoal: number;

  @ApiProperty()
  volunteerGoalDeadline: Date;

  @ApiProperty()
  funding: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  phase: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  organizerId: string;

  @ApiProperty()
  organizer: UserEntity;

  @ApiProperty()
  objectives: ProjectObjective;

  @ApiProperty()
  requirements: ProjectRequirement;

  @ApiProperty()
  volunteers: UserEntity;

  @ApiProperty()
  donations: ProjectDonation;

  @ApiProperty()
  donationsCount?: number;
  
  @ApiProperty()
  volunteersCount?: number;
}
