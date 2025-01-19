export const jwtConstants = {
  secretKey: process.env.JWT_SECRET,
};

export const conversationConstants = {
  conversationModelName: 'Conversation',
  messageModelName: 'Message',
  recentMessagesLimit: 20,
};
