import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

type JwtPayload = {
  sub: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const user = await this.usersService.findOne(payload['sub']);

    if (!user) {
      throw new UnauthorizedException();
    }

    // const accessToken = req.get('Authorization').replace('Bearer', '').trim();
    // const cachedAccessToken = await this.cacheManager.get(
    //   `access-token-${user.id}`,
    // );
    // const valid = cachedAccessToken === accessToken;

    // if (!valid) {
    //   throw new UnauthorizedException();
    // }

    return user;
  }
}
