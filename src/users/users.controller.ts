import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  private userService: UsersService;
  @Get('/:id')
  async getUser(@Param('username') username: string) {
    if (!username) throw new BadRequestException('Username is not present');

    const user = this.userService.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
