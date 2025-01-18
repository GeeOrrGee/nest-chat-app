import {
  Body,
  Controller,
  Get,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  @Get('/')
  async getUser(@Body() body) {
    const { username } = body;
    if (!username)
      throw new NotFoundException('User not found or username is not present');
  }
}
