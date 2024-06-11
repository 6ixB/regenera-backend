import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ProjectDonationDto {
  constructor(amount: number, donatorId: string) {
    this.amount = amount;
    this.donatorId = donatorId;
  }
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  donatorId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(1000)
  amount: number;
}
