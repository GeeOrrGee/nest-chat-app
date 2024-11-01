import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    /**
     *  1- setup jwt creds
     *  2- add creation of the tokens
     *  3- middleware for token validation
     *  4- add refresh token endpoint
     *  5- Prepare for session ID
     *
     */
    return result;
  }
}
