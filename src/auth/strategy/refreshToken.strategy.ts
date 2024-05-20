import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

const extractJwtFromCookie = (req: Request): string | null => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies['refreshToken'];
  }

  return token;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.cookies['refreshToken'];
    return { ...payload, refreshToken };
  }
}
