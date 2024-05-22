import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { AuthEntity } from './entity/auth.entity';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { SignInWithGoogleDto } from './dto/signinWithGoogle.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiCreatedResponse({ type: AuthEntity })
  async signin(@Body() { email, password }: SignInDto) {
    return await this.authService.signin(email, password);
  }

  @Post('signin/google')
  @ApiCreatedResponse({ type: AuthEntity })
  async signinWithGoogle(@Body() { idToken }: SignInWithGoogleDto) {
    return await this.authService.signinWithGoogle(idToken);
  }

  @Post('signout')
  @ApiBearerAuth()
  @ApiOkResponse()
  @UseGuards(AccessTokenGuard)
  signout(@User() user: UserEntity) {
    return this.authService.signout(user.id);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: AuthEntity })
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];

    return await this.authService.refreshTokens(userId, refreshToken);
  }
}
