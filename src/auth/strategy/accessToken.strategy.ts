import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

type JwtPayload = {
  sub: string;
  username: string;
};

const extractJwtFromCookie = (req: Request): string | null => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies['accessToken'];
  }

  return token;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET_KEY'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload['sub']);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
