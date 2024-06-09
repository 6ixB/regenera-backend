import { PartialType } from '@nestjs/swagger';
import { CreateChatRoomRelationDto } from './create-chat-room-relation.dto';

export class UpdateChatRoomRelationDto extends PartialType(CreateChatRoomRelationDto) {}
