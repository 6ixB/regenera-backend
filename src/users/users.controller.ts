import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { UserProfileEntity } from './entities/user.profile.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FileUploadDto } from 'src/common/dto/file-upload.to';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    return new UserEntity(await this.usersService.findOne(id));
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserEntity,
  ) {
    if (user.id !== id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id') id: string) {
    return new UserEntity(await this.usersService.remove(id));
  }

  @Post('profiles/:id/banners/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({ type: UserEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async uploadUserProfileBanner(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(png|jpeg|jpg)',
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return new UserEntity(
      await this.usersService.uploadProfileBanner(id, file),
    );
  }

  @Post('profiles/:id/images/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({ type: UserEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async uploadUserProfileImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(png|jpeg|jpg)',
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return new UserEntity(await this.usersService.uploadProfileImage(id, file));
  }

  @Get('profiles/:id')
  @ApiOkResponse({ type: UserProfileEntity })
  async findOneProfile(@Param('id') id: string) {
    const user = await this.usersService.findOneProfile(id);

    if (!user) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return new UserProfileEntity(user);
  }

  @Patch('profiles/:id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiCreatedResponse({ type: UserProfileEntity })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @User() user: UserEntity,
  ) {
    if (user.id !== id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return new UserProfileEntity(
      await this.usersService.updateProfile(id, updateUserProfileDto),
    );
  }
}
