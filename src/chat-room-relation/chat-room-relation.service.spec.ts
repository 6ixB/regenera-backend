import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomRelationService } from './chat-room-relation.service';

describe('ChatRoomRelationService', () => {
  let service: ChatRoomRelationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatRoomRelationService],
    }).compile();

    service = module.get<ChatRoomRelationService>(ChatRoomRelationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
