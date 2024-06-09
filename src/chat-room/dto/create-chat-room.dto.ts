import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatRoomDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}
