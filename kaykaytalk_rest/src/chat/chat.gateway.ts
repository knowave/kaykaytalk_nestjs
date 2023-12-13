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
    const messages = this.chatService.getAllChatByUserId(userId, roomId);

    return this.server.emit('receiveMessages', messages);
  }

  @SubscribeMessage('updateChat')
  async update(
    payload: { userId: number },
    @MessageBody() updateChatDto: UpdateChatDto,
  ) {
    const { userId } = payload;
    const updateMessage = await this.chatService.updateChatMessage(
      userId,
      updateChatDto,
    );

    return this.server.emit('updateMessage', updateMessage);
  }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }
}
