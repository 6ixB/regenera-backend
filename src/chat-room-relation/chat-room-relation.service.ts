import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatRoomRelationDto } from './dto/create-chat-room-relation.dto';
import { UpdateChatRoomRelationDto } from './dto/update-chat-room-relation.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ChatRoomRelationService {
  constructor(private prisma: PrismaService) {}

  async create(createChatRoomRelationDto: CreateChatRoomRelationDto) {
    const chatRelationData = {
      ...createChatRoomRelationDto
    };

    return await this.prisma.chatRoomUser.create({data: chatRelationData});
  }

  async findAllByUserId(userId: string) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const chatRooms = await this.prisma.chatRoomUser.findMany({
      where: { userId },
      include: { chatRoom: true },
    });

    return chatRooms.map(chatRoomUser => chatRoomUser.chatRoom);
  }

  async findAllByChatRoomId(chatRoomId: string) {
    const chatRoomExist = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoomExist) {
      throw new NotFoundException(`Chat Room with id ${chatRoomId} not found`);
    }

    const userIds = await this.prisma.chatRoomUser.findMany({
      where: { chatRoomId },
      include: { user: true },
    });

    return userIds.map(users => users.user);
  }
}
