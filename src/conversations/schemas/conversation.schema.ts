import { Schema } from 'mongoose';

export const ConversationSchema = new Schema({
  title: { type: String, required: true },
  participants: [{ type: String, required: true }],
  recentMsgs: [{ type: Array, default: [] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
