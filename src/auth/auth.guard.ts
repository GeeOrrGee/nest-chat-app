import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    let token = null;
    if (!request.headers) {
      console.log('Switching to WS');
      token = context.switchToWs().getClient().handshake?.auth?.token;
    } else {
      token = this.extractTokenFromHeader(request);
    }

    if (!token) throw new UnauthorizedException('Invalid token');

    try {
      const user = await this.jwtService.verifyAsync(token);
      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
