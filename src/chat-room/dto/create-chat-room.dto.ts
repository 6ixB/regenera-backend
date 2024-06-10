import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatRoomDto {

  @ApiProperty({ example: 'Community Park Renovation' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  projectId: string;
}
