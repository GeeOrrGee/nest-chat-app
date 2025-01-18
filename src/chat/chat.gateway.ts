import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(50, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  private server: Server;
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('connection_success', { message: 'Welcome to the server!' });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit('user_disconnected', { id: client.id });
  }
  @SubscribeMessage('chat')
  handleMessage(@MessageBody() body): WsResponse<unknown> {
    console.log({ body });
    return { event: 'chat', data: body };
  }
}
