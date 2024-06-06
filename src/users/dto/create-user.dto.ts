import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ type: () => String, required: false, nullable: true })
  password?: string;
}
