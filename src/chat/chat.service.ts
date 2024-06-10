import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  create(createChatDto: CreateChatDto) {
    const chatRoomData = {
      ...createChatDto
    };

    return this.prisma.chat.create({data: createChatDto});
  }

  async findAllByChatRoomId(chatRoomId: string) {
    const chatRoomExist = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoomExist) {
      throw new NotFoundException(`Chat Room with id ${chatRoomId} not found`);
    }

    const chats = await this.prisma.chat.findMany({
      where: { chatRoomId },
      include: { user: true },
    });

    return chats;
  }
}
