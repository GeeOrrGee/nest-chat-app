import { Schema } from 'mongoose';

export const MessageSchema = new Schema({
  content: { type: String, required: true },
  sender: { type: String, required: true },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});
