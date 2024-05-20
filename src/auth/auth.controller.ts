import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { AuthEntity } from './entity/auth.entity';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { SignInWithGoogleDto } from './dto/signinWithGoogle.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiCreatedResponse({ type: AuthEntity })
  async signin(@Body() { email, password }: SignInDto, @Res() res: Response) {
    const tokens = await this.authService.signin(email, password);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 60 * 1000),
    });

    res.status(HttpStatus.CREATED).send();
  }

  @Post('signinWithGoogle')
  @ApiCreatedResponse({ type: AuthEntity })
  async signinWithGoogle(
    @Body() { email, idToken }: SignInWithGoogleDto,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.signinWithGoogle(email, idToken);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 60 * 1000),
    });

    res.status(HttpStatus.CREATED).send();
  }

  @Post('signout')
  @ApiBearerAuth()
  @ApiOkResponse()
  @UseGuards(AccessTokenGuard)
  signout(@User() user: UserEntity, @Res() res: Response) {
    this.authService.signout(user.id);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(HttpStatus.OK).send();
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: AuthEntity })
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];

    const tokens = await this.authService.refreshTokens(userId, refreshToken);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 60 * 1000),
    });

    res.status(HttpStatus.CREATED).send();
  }
}
