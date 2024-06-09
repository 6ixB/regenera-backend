import { ApiProperty } from "@nestjs/swagger";
import { Chat } from "@prisma/client";

export class ChatEntity implements Chat {
    constructor(partial: Partial<ChatEntity>){
        Object.assign(this,partial);
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    chatRoomId: string;
}
