import { Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto, ProjectPhaseEnum } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'nestjs-prisma';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { v4 as uuidv4 } from 'uuid';
import { ProjectObjectiveDto } from './dto/project-objective.dto';
import { UserEntity } from 'src/users/entities/user.entity';

const bucketName = 'regenera-da102.appspot.com';

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
        address: createProjectDto.address,
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
    return this.prisma.project
      .findMany({
        include: {
          organizer: true,
          _count: {
            select: {
              donations: true,
              volunteers: true,
            },
          },
        },
      })
      .then((projects) => {
        return projects.map((project) => ({
          ...project,
          donationsCount: project._count.donations,
          volunteersCount: project._count.volunteers,
          _count: undefined,
        }));
      });
  }

  findOne(id: string) {
    return this.prisma.project
      .findUnique({
        where: { id },
        include: {
          organizer: true,
          objectives: {
            select: {
              id: true,
              imageUrl: true,
              objective: true,
              projectId: false,
              submission: {
                select: {
                  id: true,
                  imageUrl: true,
                  objectiveId: false,
                  submitterId: false,
                  submitter: {
                    select: {
                      username: true,
                      password: false,
                    },
                  },
                },
              },
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
          _count: {
            select: {
              donations: true,
              volunteers: true,
            },
          },
        },
      })
      .then((project) => {
        return {
          ...project,
          donationsCount: project._count.donations,
          volunteersCount: project._count.volunteers,
          _count: undefined,
        };
      });
  }

  findPopularProjects() {
    return this.prisma.project
      .findMany({
        include: {
          organizer: true,
          _count: {
            select: { volunteers: true, donations: true },
          },
        },
        take: 5,
        orderBy: [
          { donations: { _count: 'desc' } },
          { volunteers: { _count: 'desc' } },
        ],
      })
      .then((projects) => {
        return projects.map((project) => ({
          ...project,
          donationsCount: project._count.donations,
          volunteersCount: project._count.volunteers,
        }));
      });
  }

  findProjectsByOrganizer(id: string) {
    return this.prisma.project
      .findMany({
        where: { organizerId: id },
        include: {
          organizer: true,
          _count: {
            select: { volunteers: true, donations: true },
          },
        },
      })
      .then((projects) => {
        return projects.map((project) => ({
          ...project,
          donationsCount: project._count.donations,
          volunteersCount: project._count.volunteers,
          _count: undefined,
        }));
      });
  }

  findProjectsByVolunteer(id: string) {
    return this.prisma.project
      .findMany({
        where: { volunteers: { some: { volunteerId: id } } },
        include: {
          organizer: true,
          _count: {
            select: { volunteers: true, donations: true },
          },
        },
      })
      .then((projects) => {
        return projects.map((project) => ({
          ...project,
          donationsCount: project._count.donations,
          volunteersCount: project._count.volunteers,
          _count: undefined,
        }));
      });
  }

  findProjectsByDonator(id: string) {
    return this.prisma.project
      .findMany({
        where: { donations: { some: { donatorId: id } } },
        include: {
          organizer: true,
          _count: {
            select: { volunteers: true, donations: true },
          },
        },
      })
      .then((projects) => {
        return projects.map((project) => ({
          ...project,
          donationsCount: project._count.donations,
          volunteersCount: project._count.volunteers,
          _count: undefined,
        }));
      });
  }

  async findProjectTopDonations(id: string) {
    const topDonations = await this.prisma.projectDonation.groupBy({
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

    const topDonationsDetails = await Promise.all(
      topDonations.map(async (donation) => {
        const donatorDetails = await this.prisma.user.findFirst({
          where: { id: donation.donatorId },
        });

        return {
          donator: new UserEntity(donatorDetails),
          totalAmount: donation._sum.amount,
        };
      }),
    );

    return topDonationsDetails;
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

    if (
      updateProjectDto?.submissionObjectiveIds &&
      updateProjectDto?.submissionSubmitterIds &&
      updateProjectDto?.submissionImages
    ) {
      return this.updateProjectSubmission(
        id,
        updateProjectDto.submissionObjectiveIds,
        updateProjectDto.submissionSubmitterIds,
        updateProjectDto.submissionImages,
      );
    }

    const existingProject = await this.findOne(id);

    const requirementIds = existingProject.requirements.map((requirement) => ({
      id: requirement.id,
    }));

    if (donation !== undefined) {
      projectData.funding = existingProject.funding + donation.amount;
    }

    if (updateProjectDto.meetupDate) {
      projectData.phase = ProjectPhaseEnum.ONGOING;
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        requirements: { connect: requirementIds },
        donations: {
          connectOrCreate: donation
            ? [
                {
                  where: { id: donation.donatorId },
                  create: donation,
                },
              ]
            : undefined,
        },
      },
      include: { donations: true, volunteers: true },
    });
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }

  async uploadProjectImage(id: string, file: Express.Multer.File) {
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

  async updateProjectSubmission(
    projectId: string,
    submissionObjectiveIds: string[],
    submissionSubmitterIds: string[],
    submissionImages: Express.Multer.File[],
  ) {
    const existingSubmissions = await Promise.all(
      submissionObjectiveIds.map(async (objectiveId, idx) => {
        return this.prisma.projectSubmission.findFirst({
          where: {
            AND: [
              { objectiveId: objectiveId },
              { submitterId: submissionSubmitterIds[idx] },
            ],
          },
        });
      }),
    );

    existingSubmissions.forEach(async (existingSubmission) => {
      if (existingSubmission) {
        if (existingSubmission.imageUrl) {
          await this.firebase.storage
            .bucket(bucketName)
            .file(
              existingSubmission.imageUrl.replace(
                `https://storage.googleapis.com/${bucketName}/`,
                '',
              ),
            )
            .delete();
        }
      }
    });

    const submissionImageUrls = await Promise.all(
      submissionObjectiveIds.map((objectiveId, idx) => {
        return this.uploadProjectSubmissionImage(
          projectId,
          objectiveId,
          submissionImages[idx],
        );
      }),
    );

    const submissions = submissionImageUrls.map((url, idx) => ({
      objectiveId: submissionObjectiveIds[idx],
      submitterId: submissionSubmitterIds[idx],
      imageUrl: url,
    }));

    submissions.forEach(async (submission) => {
      const existingSubmission = existingSubmissions.find(
        (existingSubmission) =>
          existingSubmission &&
          existingSubmission.objectiveId === submission.objectiveId,
      );

      if (existingSubmission) {
        await this.prisma.projectSubmission.update({
          where: { id: existingSubmission.id },
          data: submission,
        });
      } else {
        await this.prisma.projectSubmission.create({
          data: submission,
        });
      }
    });
  }

  async uploadProjectSubmissionImage(
    projectId: string,
    objectiveId,
    file: Express.Multer.File,
  ) {
    const fileName = `projects/${projectId}/objectives/${objectiveId}/submission/${uuidv4()}.${file.mimetype.replace('image/', '')}`;

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
