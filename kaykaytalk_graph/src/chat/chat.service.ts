import { Injectable, NotFoundException } from '@nestjs/common';
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
    const saveChat = new this.ChatModel(createChatDto);
    return saveChat.save();
  }

  async getAllChatByUserId(userId: number, roomId: number) {
    const chats = await this.ChatModel.find({ userId, roomId });
    return chats;
  }

  async updateChatMessage(userId: number, updateChatDto: UpdateChatDto) {
    const chatMessage = await this.ChatModel.findOne({
      userId,
      messageId: updateChatDto.messageId,
    });

    if (!chatMessage) throw new NotFoundException();

    chatMessage.content = updateChatDto.content;

    return await chatMessage.save();
  }
}
