import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatRoomRelationDto {
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    chatRoomId: string;
  
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    userId: string;
}
