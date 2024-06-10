import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from 'nestjs-prisma';
import { ChatGateway } from './gateaway/chat.gateway';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  imports: [PrismaModule]
})
export class ChatModule {}
