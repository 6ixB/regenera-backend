import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInWithGoogleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  idToken: string;
}
