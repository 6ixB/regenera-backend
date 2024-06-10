import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseInterceptors, ValidationPipe, UploadedFiles } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ChatEntity } from './entities/chat.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 }
    ]),
  )
  @ApiCreatedResponse({ type: ChatEntity})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateChatDto,
  })
  async create(
    @Body(new ValidationPipe({ transform: true })) 
    createChatDto: CreateChatDto,
    @UploadedFiles()
    files:{
      image?: Express.Multer.File[];
    },
  ){
    createChatDto.image = files.image?.[0];
    
    const chat = await this.chatService.create(createChatDto);
    chat.user = new UserEntity(chat.user)

    return this.chatService.create(createChatDto);
  }

  @Get(':chatRoomId')
  async findAllByChatRoomId(@Param('chatRoomId') chatRoomId: string) {
    const chats = await this.chatService.findAllByChatRoomId(chatRoomId);

    const transformedChats = chats.map(chat => ({
      ...chat,
      user: new UserEntity(chat.user),
    }));
  
    return transformedChats;
  }
}
