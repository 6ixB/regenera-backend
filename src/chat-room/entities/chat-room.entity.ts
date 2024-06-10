import { ApiProperty } from "@nestjs/swagger";
import { ChatRoom } from "@prisma/client";

export class ChatRoomEntity implements ChatRoom {
    constructor(partial: Partial<ChatRoomEntity>){
        Object.assign(this,partial);
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    createdAt: Date;

}
