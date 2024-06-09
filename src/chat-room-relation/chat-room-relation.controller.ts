import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatRoomRelationService } from './chat-room-relation.service';
import { CreateChatRoomRelationDto } from './dto/create-chat-room-relation.dto';
import { UpdateChatRoomRelationDto } from './dto/update-chat-room-relation.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ChatRoomRelationEntity } from './entities/chat-room-relation.entity';

@Controller('chat-room-relation')
@ApiTags('chat-room-relation')
export class ChatRoomRelationController {
  constructor(private readonly chatRoomRelationService: ChatRoomRelationService) {}

  @Post()
  @ApiCreatedResponse({ type: ChatRoomRelationEntity})
  create(@Body() createChatRoomRelationDto: CreateChatRoomRelationDto) {
    return this.chatRoomRelationService.create(createChatRoomRelationDto);
  }

  @Get(':userId')
  async findAllByUserId(@Param('userId') userId: string) {
    return this.chatRoomRelationService.findAllByUserId(userId);
  }

  @Get(':chatRoomId')
  async findAllByChatRoomId(@Param('userId') userId: string) {
    return this.chatRoomRelationService.findAllByChatRoomId(userId);
  }
}
