import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { UserEntity } from 'src/users/entities/user.entity';
import { instanceToPlain } from 'class-transformer';
import { OAuth2Client } from 'google-auth-library';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

const client = new OAuth2Client();

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  async getTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET_KEY'),
          expiresIn: '5s',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
          expiresIn: '30m',
        },
      ),
    ]);

    const currentDate = new Date();
    const aliveDuration = 5 * 1000;
    const expiresIn = currentDate.setTime(
      currentDate.getTime() + aliveDuration,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      Number(this.configService.get<string>('BCRYPT_ROUNDS_OF_HASHING')),
    );

    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async signin(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const userEntity = new UserEntity(user);
    const plainUserEntity = instanceToPlain(userEntity);

    return {
      user: plainUserEntity as UserEntity,
      ...tokens,
    };
  }

  async signinWithGoogle(idToken: string): Promise<AuthEntity> {
    let payload;

    try {
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: this.configService.get<string>('AUTH_GOOGLE_ID'),
      });

      payload = ticket.getPayload();
    } catch (error) {
      throw new BadRequestException('Invalid ID token');
    }

    const { sub: googleId, email, name } = payload;

    let user = await this.usersService.findOneByEmail(email);

    if (!user) {
      const createUserDto: CreateUserDto = {
        email,
        username: name,
      };

      user = await this.usersService.create(createUserDto, googleId);
    }

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const userEntity = new UserEntity(user);
    const plainUserEntity = instanceToPlain(userEntity);

    return {
      user: plainUserEntity as UserEntity,
      ...tokens,
    };
  }

  async signout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }
}
