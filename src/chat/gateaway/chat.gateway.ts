import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})

@ApiTags('chat-websocket')
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  @ApiOperation({ summary: 'Send a message' })
  @ApiBody({ type: CreateChatDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 }
    ]),
  )
  async handleSendMessage(@MessageBody() message: CreateChatDto, @ConnectedSocket() client: Socket, @UploadedFiles() files: { image?: Express.Multer.File[] }): Promise<void> {
    if (files.image) {
      message.image = files.image[0];
    }

    const chat = await this.chatService.create(message);
    this.server.to(message.chatRoomId).emit('message', chat);
  }

  @SubscribeMessage('joinRoom')
  @ApiOperation({ summary: 'Join a chat room' })
  @ApiBody({ type: Object, description: 'Contains chatRoomId' })
  handleJoinRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    client.join(data.chatRoomId);
    client.emit('joinedRoom', data.chatRoomId);
  }

  @SubscribeMessage('leaveRoom')
  @ApiOperation({ summary: 'Leave a chat room' })
  @ApiBody({ type: Object, description: 'Contains chatRoomId' })
  handleLeaveRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    client.leave(data.chatRoomId);
    client.emit('leftRoom', data.chatRoomId);
  }

  @SubscribeMessage('getChatsInRoom')
  @ApiOperation({ summary: 'Get chats in a chat room' })
  @ApiBody({ type: Object, description: 'Contains chatRoomId' })
  async handleGetChatsInRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<void> {
    const chats = await this.chatService.findAllByChatRoomId(data.chatRoomId);
    client.emit('chatsInRoom', chats);
  }
}
