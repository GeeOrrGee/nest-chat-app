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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/users/dto/user.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

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
    const parsedObj = JSON.parse(Object.keys(signInDto)[0]);
    return this.authService.signIn(parsedObj.username, parsedObj.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async registerUser(@Body() userData: UserDTO, @Res() res: Response) {
    const parsedObj = JSON.parse(Object.keys(userData)[0]); //TODO parse data appropriately
    const { accessToken, refreshToken } =
      await this.authService.signUp(parsedObj);

    res.cookie('accessToken', accessToken, tokenConfig);
    res.cookie('refreshToken', refreshToken, tokenConfig);

    return res.send();
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

      await this.usersService.updateUser(payload, refreshToken); //update refresh token

      res.cookie('accessToken', accessToken, tokenConfig);
      res.cookie('refreshToken', refreshToken, tokenConfig);

      res.send();
    } catch {
      throw new UnauthorizedException('Invalid Refresh token');
    }
  }
}
