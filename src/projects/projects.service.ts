import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'nestjs-prisma';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) { }

  async create(createProjectDto: CreateProjectDto) {
    const projectId = uuidv4();
    const imageUrl = this.uploadProjectImage(projectId, createProjectDto.image);
    const objectiveImagesUrl = await Promise.all(
      createProjectDto.objectives.map(async (objective) => {
        if (objective.image) {
          return this.uploadProjectObjectiveImage(projectId, objective.image);
        }
        return null;
      }),
    );

    createProjectDto.image = imageUrl;

    createProjectDto.objectives.map((objective, idx) => {
      objective.image = objectiveImagesUrl[idx];
    });

    const projectData = {
      id: projectId,
      ...createProjectDto,
      funding: 0,
      rating: 0,
      objectives: {
        create: createProjectDto.objectives,
      },
      requirement: {
        create: createProjectDto.requirements,
      },
      organizerId: createProjectDto.organizerId,
    };

    return this.prisma.project.create({
      data: {
        id: projectId,
        ...createProjectDto,
        funding: 0,
        rating: 0,
        organizerId: createProjectDto.organizerId,
      },
    });
  }

  findAll() {
    return this.prisma.project.findMany();
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }

  async uploadProjectImage(id: string, file: Express.Multer.File) {
    const bucketName = 'regenera-da102.appspot.com';

    const user = await this.findOne(id);

    if (user.imageUrl) {
      await this.firebase.storage
        .bucket(bucketName)
        .file(
          user.imageUrl.replace(
            `https://storage.googleapis.com/${bucketName}/`,
            '',
          ),
        )
        .delete();
    }

    const fileName = `projects/${id}/images/${uuidv4()}.${file.mimetype.replace('image/', '')}`;

    await this.firebase.storage
      .bucket(bucketName)
      .file(fileName)
      .save(file.buffer, {});

    const fileRef = this.firebase.storage.bucket(bucketName).file(fileName);

    fileRef.makePublic();

    const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return this.update(id, { image: imageUrl });
  }

  async uploadProjectObjectiveImage(id: string, file: Express.Multer.File) {
    const bucketName = 'regenera-da102.appspot.com';

    const user = await this.findOne(id);

    if (user.imageUrl) {
      await this.firebase.storage
        .bucket(bucketName)
        .file(
          user.imageUrl.replace(
            `https://storage.googleapis.com/${bucketName}/`,
            '',
          ),
        )
        .delete();
    }

    const fileName = `projects/${id}/objectives/${uuidv4()}.${file.mimetype.replace('image/', '')}`;

    await this.firebase.storage
      .bucket(bucketName)
      .file(fileName)
      .save(file.buffer, {});

    const fileRef = this.firebase.storage.bucket(bucketName).file(fileName);

    fileRef.makePublic();

    const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return this.update(id, { image: imageUrl });
  }
}
