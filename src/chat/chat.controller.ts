import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ChatEntity } from './entities/chat.entity';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiCreatedResponse({ type: ChatEntity})
  create(@Body() createChatDto: CreateChatDto) {
    Logger.log(createChatDto.chatRoomId)
    return this.chatService.create(createChatDto);
  }

  @Get(':chatRoomId')
  async findAllByChatRoomId(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.findAllByChatRoomId(chatRoomId);
  }
}
