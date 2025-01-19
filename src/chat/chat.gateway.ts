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
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway(50, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  private server: Server;
  constructor(private readonly authService: AuthService) {}
  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const token = client.handshake.auth.token;
    try {
      await this.authService.validateToken(token);
    } catch {
      client.emit('error', { message: 'Invalid token' });
      client.disconnect();
      return;
    }
    client.emit('connection_success', { message: 'Welcome to the server!' });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit('user_disconnected', { id: client.id });
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('chat')
  handleMessage(@MessageBody() body: object): WsResponse<unknown> {
    console.log({ body });
    return { event: 'chat', data: body };
  }
}
