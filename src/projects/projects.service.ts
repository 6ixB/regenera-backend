import { Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'nestjs-prisma';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { v4 as uuidv4 } from 'uuid';
import { ProjectObjectiveDto } from './dto/project-objective.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const projectId = uuidv4();
    const imageUrl = await this.uploadProjectImage(
      projectId,
      createProjectDto.image,
    );

    createProjectDto.image = imageUrl;

    const objectiveImageUrls = await Promise.all(
      createProjectDto.objectiveImages.map((image) => {
        return this.uploadProjectObjectiveImage(projectId, image);
      }),
    );

    const objectives: ProjectObjectiveDto[] = objectiveImageUrls.map(
      (url, idx) => ({
        imageUrl: url,
        objective: createProjectDto.objectiveDescriptions[idx],
      }),
    );

    return this.prisma.project.create({
      data: {
        id: projectId,
        title: createProjectDto.title,
        description: createProjectDto.description,
        imageUrl: createProjectDto.image,
        fundingGoal: createProjectDto.fundingGoal,
        funding: 0,
        rating: 0,
        deadline: createProjectDto.deadline,
        organizer: {
          connect: { id: createProjectDto.organizerId },
        },
        objectives: {
          create: objectives,
        },
        requirements: {
          create: createProjectDto.requirements,
        },
      },
      include: { organizer: true },
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      include: { organizer: true },
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        organizer: true,
        objectives: true,
        requirements: true,
        donations: true,
      },
    });
  }

  findOrganizerProjects(id: string) {
    return this.prisma.project.findMany({
      where: { organizerId: id },
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    // return this.prisma.project.update({
    //   where: { id },
    //   data: updateProjectDto,
    // });
    return { id, updateProjectDto };
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }

  async uploadProjectImage(id: string, file: Express.Multer.File) {
    const bucketName = 'regenera-da102.appspot.com';

    const fileName = `projects/${id}/images/${uuidv4()}.${file.mimetype.replace('image/', '')}`;

    await this.firebase.storage
      .bucket(bucketName)
      .file(fileName)
      .save(file.buffer, {});

    const fileRef = this.firebase.storage.bucket(bucketName).file(fileName);

    fileRef.makePublic();

    const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return imageUrl;
  }

  async uploadProjectObjectiveImage(id: string, file: Express.Multer.File) {
    const bucketName = 'regenera-da102.appspot.com';

    const fileName = `projects/${id}/objectives/${uuidv4()}.${file.mimetype.replace('image/', '')}`;

    await this.firebase.storage
      .bucket(bucketName)
      .file(fileName)
      .save(file.buffer, {});

    const fileRef = this.firebase.storage.bucket(bucketName).file(fileName);

    fileRef.makePublic();

    const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return imageUrl;
  }
}
