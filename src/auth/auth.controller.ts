import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UnauthorizedException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/users/dto/user.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';

const tokenConfig = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60, //1h
};
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async registerUser(@Body() userData: UserDTO, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.signUp(userData);

    res.cookie('accessToken', accessToken, tokenConfig);
    res.cookie('refreshToken', refreshToken, tokenConfig);

    return res.send();
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(@Req() req: Request) {
    const { refreshToken } = req.cookies;

    await this.authService.signOut(refreshToken);
  }

  @Post('refresh-token')
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies.refreshToken;

    if (!refresh_token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      const payload = (await this.jwtService.verifyAsync(
        refresh_token,
      )) as UserDTO;

      const existingUser = await this.usersService.findByUsername(
        payload.username,
      );
      if (!existingUser || existingUser.refreshToken !== refresh_token) {
        throw new ForbiddenException('Illegal use of the Refresh Token');
      }

      const { accessToken, refreshToken } =
        await this.authService.generateTokens(payload);

      await this.usersService.updateUser({ refreshToken }); //update user with refresh token

      res.cookie('accessToken', accessToken, tokenConfig);
      res.cookie('refreshToken', refreshToken, tokenConfig);

      res.send();
    } catch {
      throw new UnauthorizedException('Invalid Refresh token');
    }
  }
}
