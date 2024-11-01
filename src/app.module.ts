import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

const dbPassword = 'oogabooga';
const uri = `mongodb+srv://gioxezz:${dbPassword}@cluster0.fzhka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

@Module({
  imports: [MongooseModule.forRoot(uri), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
