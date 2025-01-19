import { MessageDTO } from './message.dto';

export interface ConversationDTO {
  _id: string;
  participants: string[];
  recentMsgs: MessageDTO[];
  title: string;
}
