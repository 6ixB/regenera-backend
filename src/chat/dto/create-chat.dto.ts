import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, isNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
    @IsString()
    @ApiProperty({ example: 'Community Park Renovation' })
    @IsOptional()
    message?: string;
  
    @IsString()
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsOptional()
    image?: any;
  
    @IsString()
    @ApiProperty({ example: '12345' })
    @IsNotEmpty()
    userId: string;
  
    @IsString()
    @ApiProperty({ example: '12345' })
    @IsNotEmpty()
    chatRoomId: string;
}
