export interface MessageDTO {
  _id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: Date;
}
