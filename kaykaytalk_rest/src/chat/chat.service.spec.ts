import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

const mockChatModel = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('ChatService', () => {
  let service: ChatService;
  let chatModel: Model<Chat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken('Chat'),
          useValue: mockChatModel(),
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    chatModel = module.get<Model<Chat>>(getModelToken('Chat'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
