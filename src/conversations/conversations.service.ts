import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './models/conversation.model';
import { Message } from './models/message.model';
import { conversationConstants } from 'src/constants';
import { ConversationDTO } from './dto/conversation.dto';
import { MessageDTO } from './dto/message.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel('Conversation') private conversationModel: Model<Conversation>,
    @InjectModel('Message') private messageModel: Model<Message>,
  ) {}

  async findConvById(id: string): Promise<Conversation> {
    return this.conversationModel.findById(id).populate('messages').exec();
  }

  async findMessageByConvId(convId: string): Promise<Message> {
    return this.messageModel.findById(convId).exec();
  }

  async createConversation(
    participants: string[],
    data: Partial<ConversationDTO>,
  ): Promise<Conversation> {
    const defaultValue = {
      title: 'New Conversation',
      recentMsgs: [],
      ...data,
    };
    const newConversation = new this.conversationModel(defaultValue);
    return newConversation.save();
  }

  async addMessage(
    conversationId: string,
    messageData: MessageDTO,
  ): Promise<Message> {
    const conversation = await this.findConvById(conversationId);
    const newMessage = new this.messageModel(messageData);

    const limitExceeded =
      conversation.recentMsgs.length >=
      conversationConstants.recentMessagesLimit;

    if (limitExceeded) {
      conversation.recentMsgs.shift();
    }

    conversation.recentMsgs.push(messageData);

    await conversation.save();
    return newMessage.save();
  }
}
