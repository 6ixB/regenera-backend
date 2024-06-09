import { Injectable } from '@nestjs/common';
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
        fundingGoalDeadline: createProjectDto.fundingGoalDeadline,
        volunteerGoal: createProjectDto.volunteerGoal,
        volunteerGoalDeadline: createProjectDto.volunteerGoalDeadline,
        funding: 0,
        rating: 0,
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
        objectives: {
          select: {
            id: true,
            imageUrl: true,
            objective: true,
            projectId: false,
          },
        },
        requirements: {
          select: {
            id: true,
            requirement: true,
            quantity: true,
            projectId: false,
          },
        },
        donations: true,
        volunteers: {
          select: {
            id: false,
            project: false,
            projectId: false,
            volunteer: true,
          },
        },
      },
    });
  }

  findProjectsByOrganizer(id: string) {
    return this.prisma.project.findMany({
      where: { organizerId: id },
    });
  }

  findProjectsByVolunteer(id: string) {
    return this.prisma.project.findMany({
      where: { volunteers: { some: { volunteerId: id } } },
      include: { organizer: true },
    });
  }

  findProjectsByDonator(id: string) {
    return this.prisma.project.findMany({
      where: { donations: { some: { donatorId: id } } },
      include: { organizer: true },
    });
  }

  async findProjectTopDonations(id: string) {
    return this.prisma.projectDonation.groupBy({
      by: ['donatorId'],
      where: {
        projectId: id,
      },
      _sum: {
        amount: true,
      },
      orderBy: { _sum: { amount: 'desc' } },
      take: 3,
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const { volunteerId, donation, ...projectData } = updateProjectDto;

    if (volunteerId) {
      const existingVolunteer = await this.prisma.projectVolunteer.findFirst({
        where: {
          AND: [{ projectId: id }, { volunteerId: volunteerId }],
        },
      });

      if (!existingVolunteer) {
        return this.prisma.projectVolunteer.create({
          data: { projectId: id, volunteerId: volunteerId },
        });
      }
    }

    const existingProject = await this.findOne(id);

    const requirementIds = existingProject.requirements.map((requirement) => ({
      id: requirement.id,
    }));

    if (donation) {
      projectData.funding = existingProject.funding + donation.amount;
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        requirements: { connect: requirementIds },
        donations: {
          connectOrCreate: [
            {
              where: { id: donation.donatorId },
              create: donation,
            },
          ],
        },
      },
      include: { donations: true, volunteers: true },
    });
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
