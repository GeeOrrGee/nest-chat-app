import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';

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

  @UseGuards(AuthGuard)
  @SubscribeMessage('chat')
  handleMessage(@MessageBody() body: string): WsResponse<unknown> {
    console.log({ body });
    return { event: 'chat', data: body };
  }
}
