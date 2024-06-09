import { ApiProperty } from "@nestjs/swagger";
import { ChatRoom, ChatRoomUser } from "@prisma/client";

export class ChatRoomRelationEntity implements ChatRoomUser {
    constructor(partial: Partial<ChatRoomRelationEntity>){
        Object.assign(this,partial);
    }

    @ApiProperty()
    chatRoomId: string;
    
    @ApiProperty()
    userId: string;
}
