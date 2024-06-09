import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
  imports: [PrismaModule]
})
export class ChatRoomModule {}
