import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop()
  userId: number;

  @Prop()
  roomId: number;

  @Prop()
  username: string;

  @Prop()
  content: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
