import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/users/dto/user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (!user) throw new NotFoundException('User not found');
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    /**
     *  4- add refresh token endpoint
     *  5- Prepare for session ID
     */
    delete user.password;
    const tokens = this.generateTokens(user);
    return tokens;
  }

  async signUp(userData: UserDTO) {
    const tokens = await this.generateTokens(userData);
    await this.usersService.create(userData, tokens.refreshToken);
    return tokens;
  }

  async generateTokens(userData: UserDTO) {
    const accessToken = await this.jwtService.signAsync(userData, {
      expiresIn: '5m',
    });
    const refreshToken = await this.jwtService.signAsync(userData, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
