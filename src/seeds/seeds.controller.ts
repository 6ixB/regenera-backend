import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ProjectEntity } from 'src/projects/entities/project.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('seeds')
@ApiTags('seeds')
export class SeedsController {
  constructor(private readonly seedsService: SeedsService) {}

  @Post()
  @ApiCreatedResponse({ type: ProjectEntity, isArray: true })
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  @ApiBody({
    type: CreateSeedDto,
  })
  create(@Body() createSeedDto: CreateSeedDto) {
    return this.seedsService.create(createSeedDto);
  }

  @Get()
  findAll() {
    return this.seedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seedsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeedDto: UpdateSeedDto) {
    return this.seedsService.update(+id, updateSeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seedsService.remove(+id);
  }
}
