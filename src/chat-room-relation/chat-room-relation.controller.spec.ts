import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomRelationController } from './chat-room-relation.controller';
import { ChatRoomRelationService } from './chat-room-relation.service';

describe('ChatRoomRelationController', () => {
  let controller: ChatRoomRelationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatRoomRelationController],
      providers: [ChatRoomRelationService],
    }).compile();

    controller = module.get<ChatRoomRelationController>(ChatRoomRelationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
