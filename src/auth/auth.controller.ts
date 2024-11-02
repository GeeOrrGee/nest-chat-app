import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/users/dto/user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, //1h
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, //1h
    });
    return res.send();
  }
}
