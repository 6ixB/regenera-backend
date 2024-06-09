import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, isNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
    @IsString()
    @ApiProperty()
    @IsOptional()
    message?: string;
  
    @IsString()
    @ApiProperty()
    @IsOptional()
    image?: string;
  
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    userId: string;
  
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    chatRoomId: string;
}
