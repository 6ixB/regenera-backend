import { Module } from '@nestjs/common';
import { ChatRoomRelationService } from './chat-room-relation.service';
import { ChatRoomRelationController } from './chat-room-relation.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [ChatRoomRelationController],
  providers: [ChatRoomRelationService],
  imports: [PrismaModule]
})
export class ChatRoomRelationModule {}
