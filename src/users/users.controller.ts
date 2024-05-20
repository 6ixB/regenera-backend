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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { UserProfileEntity } from './entities/user.profile.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

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

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse()
  async me() {
    return 'Hello from me';
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

  @Get('profiles/:id')
  @ApiOkResponse({ type: UserProfileEntity })
  async findOneProfile(@Param('id') id: string) {
    return new UserProfileEntity(await this.usersService.findOneProfile(id));
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
