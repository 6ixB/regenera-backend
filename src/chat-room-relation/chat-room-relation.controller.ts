import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChatRoomRelationService } from './chat-room-relation.service';
import { CreateChatRoomRelationDto } from './dto/create-chat-room-relation.dto';
import { UpdateChatRoomRelationDto } from './dto/update-chat-room-relation.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ChatRoomRelationEntity } from './entities/chat-room-relation.entity';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('chat-room-relation')
@ApiTags('chat-room-relation')
export class ChatRoomRelationController {
  constructor(private readonly chatRoomRelationService: ChatRoomRelationService) {}

  @Post()
  @ApiCreatedResponse({ type: ChatRoomRelationEntity})
  async create(@Body() createChatRoomRelationDto: CreateChatRoomRelationDto) {
    return this.chatRoomRelationService.create(createChatRoomRelationDto);
  }

  @Get(':userId')
  async findAllByUserId(@Param('userId') userId: string) {
    return this.chatRoomRelationService.findAllByUserId(userId);
  }

  @Get(':chatRoomId')
  async findAllByChatRoomId(@Param('chatRoomId') chatRoomId: string) {
    return this.chatRoomRelationService.findAllByChatRoomId(chatRoomId);
  }
}
