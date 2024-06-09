import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ChatRoomService {
  constructor(private prisma: PrismaService) {}

  create(createChatRoomDto: CreateChatRoomDto) {
    const chatRoomData = {
      ...createChatRoomDto
    };

    return this.prisma.chatRoom.create({data: chatRoomData});
  }

  async findOne(chatRoomId: string) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    return chatRoom;
  }
}
