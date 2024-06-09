import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ChatRoomEntity } from './entities/chat-room.entity';

@Controller('chat-room')
@ApiTags('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  @ApiCreatedResponse({ type: ChatRoomEntity })
  create(@Body() createChatRoomDto: CreateChatRoomDto) {
    Logger.log(createChatRoomDto.title)
    return this.chatRoomService.create(createChatRoomDto);
  }

  @Get(':chatRoomId')
  findOne(@Param('chatRoomId') chatRoomId: string) {
    return this.chatRoomService.findOne(chatRoomId);
  }
}
