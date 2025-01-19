import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserDTO } from 'src/users/dto/user.dto';
import { MessageDTO } from '../dto/message.dto';

@Schema()
export class Conversation extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  participants: UserDTO[];

  @Prop({ default: [] })
  recentMsgs: MessageDTO[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
