import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { InternalServerErrorException } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createChat')
  async createChat(@MessageBody() createChatDto: CreateChatDto) {
    const chat = await this.chatService.createChat(createChatDto);

    this.server.emit('newChat', chat);
    return chat;
  }

  @SubscribeMessage('getAllChatByUserId')
  getAllChatByUserId(
    client: Socket,
    payload: { userId: number; roomId: number },
  ) {
    const { userId, roomId } = payload;
    return this.chatService.getAllChatByUserId(userId, roomId);
  }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }

  @SubscribeMessage('updateChat')
  update(
    payload: { userId: number },
    @MessageBody() updateChatDto: UpdateChatDto,
  ) {
    const { userId } = payload;
    return this.chatService.updateChatMessage(userId, updateChatDto);
  }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }
}
