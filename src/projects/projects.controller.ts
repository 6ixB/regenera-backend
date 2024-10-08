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
  Query,
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
import { ProjectDonationDto } from './dto/project-donation.dto';

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
  @ApiOkResponse()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const { projects, projectsTotal } = await this.projectsService.findAll(
      page,
      limit,
    );

    projects.map((project) => {
      project.organizer = new UserEntity(project.organizer);
    });

    const projectEntities = projects.map(
      (project) => new ProjectEntity(project),
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    return { projects: projectEntities, projectsTotal };
  }

  @Get('/popular')
  @ApiOkResponse({ type: ProjectEntity, isArray: true })
  async findPopularProjects() {
    const projects = await this.projectsService.findPopularProjects();
    projects.map((project) => {
      project.organizer = new UserEntity(project.organizer);
    });

    const projectEntities = projects.map(
      (project) => new ProjectEntity(project),
    );

    return projectEntities;
  }

  @Get('/latest')
  @ApiOkResponse({ type: ProjectEntity, isArray: true })
  async findLatestProjects() {
    const projects = await this.projectsService.findLatestProjects();

    projects.map((project) => {
      project.organizer = new UserEntity(project.organizer);
    });

    const projectEntities = projects.map(
      (project) => new ProjectEntity(project),
    );

    return projectEntities;
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

  @Get('top-donations/:id')
  @ApiOkResponse({ type: ProjectDonationDto })
  async findProjectsTopDonations(@Param('id') id: string) {
    return this.projectsService.findProjectTopDonations(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'submissionImages' }]))
  @ApiCreatedResponse({ type: ProjectEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateProjectDto,
  })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateProjectDto: UpdateProjectDto,
    @UploadedFiles()
    files: {
      submissionImages?: Express.Multer.File[];
    },
  ) {
    if (files?.submissionImages) {
      updateProjectDto.submissionImages = files.submissionImages;
    }
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
