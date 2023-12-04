import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './entities/chat.entity';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly ChatModel: Model<Chat>,
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    try {
      const saveChat = new this.ChatModel(createChatDto);
      return saveChat.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findChatByUserId(userIds: number[]) {
    try {
      const chats = await this.ChatModel.find({ userId: { $in: userIds } });
      return chats;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
