import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super();
  }

  base64urlDecode(base64urlString: string): any {
    const base64String = base64urlString.replace(/-/g, '+').replace(/_/g, '/');
    const buffer = Buffer.from(base64String, 'base64');
    const jsonString = buffer.toString('utf8');
    return JSON.parse(jsonString);
  }

  verifyTokenSignature(
    token: string,
    signature: string,
    secret: string,
  ): boolean {
    const hmac = crypto.createHmac('sha256', secret);
    const expectedSignature = hmac.update(token).digest('base64');
    const paddedExpectedSignature =
      expectedSignature + '='.repeat((4 - (expectedSignature.length % 4)) % 4);

    const decodedSignature = signature.replace(/-/g, '+').replace(/_/g, '/');
    const paddedDecodedSignature =
      decodedSignature + '='.repeat((4 - (decodedSignature.length % 4)) % 4);

    return paddedExpectedSignature === paddedDecodedSignature;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const secretKey = this.configService.get<string>('JWT_REFRESH_SECRET_KEY');

    Logger.log(secretKey);

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (info?.name === 'TokenExpiredError') {
      if (!authorizationHeader) {
        throw new UnauthorizedException('No authorization token found');
      }

      const refreshToken = authorizationHeader.replace('Bearer', '').trim();
      const [encodedHeader, encodedPayload, signature] =
        refreshToken.split('.');
      const decodedPayload = this.base64urlDecode(encodedPayload);
      const decodedToken = `${encodedHeader}.${encodedPayload}`;

      if (!this.verifyTokenSignature(decodedToken, signature, secretKey)) {
        throw new UnauthorizedException('Invalid token signature');
      }

      const userId = decodedPayload.sub;
      this.authService.signout(userId);
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
