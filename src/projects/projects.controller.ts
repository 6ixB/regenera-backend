import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  UploadedFiles,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectEntity } from './entities/project.entity';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('projects')
@ApiTags('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'objectiveImages' },
    ]),
  )
  @ApiCreatedResponse({ type: ProjectEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateProjectDto,
  })
  async createProjectImage(
    @Body(new ValidationPipe({ transform: true }))
    createProjectDto: CreateProjectDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      objectiveImages?: Express.Multer.File[];
    },
  ) {
    createProjectDto.image = files.image?.[0];
    createProjectDto.objectiveImages = files.objectiveImages;

    const project = await this.projectsService.create(createProjectDto);
    project.organizer = new UserEntity(project.organizer);

    return new ProjectEntity(project);
  }

  @Get()
  @ApiOkResponse({ type: ProjectEntity, isArray: true })
  async findAll() {
    const projects = await this.projectsService.findAll();
    projects.map((project) => {
      project.organizer = new UserEntity(project.organizer);
    });

    return projects;
  }

  @Get(':id')
  @ApiOkResponse({ type: ProjectEntity })
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(id);
    project.organizer = new UserEntity(project.organizer);

    return this.projectsService.findOne(id);
  }

  @Get('organizer/:id')
  @ApiOkResponse({ type: ProjectEntity })
  async findProjectsByOrganizer(@Param('id') id: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return this.projectsService.findProjectsByOrganizer(id);
  }

  @Get('volunteer/:id')
  @ApiOkResponse({ type: ProjectEntity })
  async findProjectsByVolunteer(@Param('id') id: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return this.projectsService.findProjectsByVolunteer(id);
  }

  @Get('donator/:id')
  @ApiOkResponse({ type: ProjectEntity })
  async findProjectsByDonator(@Param('id') id: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return this.projectsService.findProjectsByDonator(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiCreatedResponse({ type: ProjectEntity })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: ProjectEntity })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
