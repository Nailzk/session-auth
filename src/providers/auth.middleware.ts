import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const token: string = req.cookies.access_token;
    const payload = this.jwtService.decode(token) as any;
    const jwtExp = new Date(new Date(0).setUTCSeconds(payload.exp));
    const now = new Date();

    if (!payload || jwtExp.getTime() < now.getTime()) {
      res.sendStatus(401);
      return;
    } else if (payload && typeof payload !== 'string') {
      (req as any).user = {
        id: payload?.id,
        role: payload?.role,
      };
    }

    next();
  }
}
