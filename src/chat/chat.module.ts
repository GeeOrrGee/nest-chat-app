import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ChatGateway],
  imports: [AuthModule],
})
export class ChatModule {}
