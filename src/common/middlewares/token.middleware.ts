import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // if (req.cookies['accessToken']) {
    //   const accessToken = req.cookies['accessToken'];
    //   req.headers['authorization'] = `Bearer ${accessToken}`;
    // }
    next();
  }
}
