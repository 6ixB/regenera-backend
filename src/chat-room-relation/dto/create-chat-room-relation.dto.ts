import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatRoomRelationDto {
    @IsString()
    @ApiProperty({ example: '123455' })
    @IsNotEmpty()
    chatRoomId: string;
  
    @IsString()
    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    userId: string;
}
