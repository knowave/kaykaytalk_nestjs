import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './entities/chat.entity';
import { Model } from 'mongoose';
import { UpdateChatDto } from './dto/update-chat.dto';

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

  async getAllChatByUserId(userId: number, roomId: number) {
    try {
      const chats = await this.ChatModel.find({ userId, roomId });
      return chats;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateChatMessage(userId: number, updateChatDto: UpdateChatDto) {
    try {
      const chatMessage = await this.ChatModel.findOne({
        userId,
        messageId: updateChatDto.messageId,
      });

      if (!chatMessage) throw new NotFoundException();

      chatMessage.content = updateChatDto.content;

      return await chatMessage.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
