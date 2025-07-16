/* eslint-disable */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestContextService } from '../services/request-context.service';
import { envs } from '../config/env.config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private requestContext: RequestContextService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log('Token extraído:', token);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: envs.JWT_SECRET,
      });

      this.requestContext.setUser({
        sub: payload.sub,
        email: payload.email,
      });

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authorization = request.headers.authorization;
    console.log('Authorization header:', authorization);
    if (!authorization) {
      return undefined;
    }
    
    return authorization;
  }
}
