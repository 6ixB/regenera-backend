import { Injectable, Logger } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';
import { faker } from '@faker-js/faker';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'nestjs-prisma';
import { ProjectPhaseEnum } from 'src/projects/dto/create-project.dto';
import { UserEntity } from 'src/users/entities/user.entity';

const projectTitles = [
  'Cleaning Binus Anggrek',
  'Sweeping Kebon Jeruk Streets',
  'Beautifying City Parks',
  'Trash Cleanup Marathon',
  'Greening Urban Spaces',
  'Community Garden Initiative',
  'River Cleanup Campaign',
  'Recycling Drive for Schools',
  'Planting Trees in Public Areas',
  'Beach Cleanup Day',
];

const projectObjectives = [
  'Implementing sustainable waste management practices in urban areas.',
  'Establishing community-led initiatives to reduce plastic pollution.',
  'Creating green spaces to enhance urban biodiversity.',
  'Promoting eco-friendly transportation solutions for a cleaner environment.',
  'Organizing tree planting drives to combat deforestation.',
  'Implementing water conservation measures in local communities.',
  'Educating youth on the importance of environmental stewardship.',
  'Restoring degraded ecosystems through native species reforestation.',
  'Conducting beach cleanups to protect marine life.',
  'Building rainwater harvesting systems for sustainable water use.',
  'Establishing community gardens to promote local food production.',
  'Installing solar panels to reduce carbon emissions.',
  'Developing educational programs on sustainable living practices.',
  'Conducting energy audits to improve efficiency in public buildings.',
  'Organizing river cleanups to preserve freshwater habitats.',
  'Creating nature trails to promote outdoor recreation and conservation.',
  'Rehabilitating polluted water bodies for aquatic biodiversity.',
  'Constructing bike lanes to encourage eco-friendly transportation.',
  'Implementing composting programs to reduce organic waste.',
  'Conducting environmental awareness campaigns to engage the public in conservation efforts.',
];

const projectImageCategories = [
  'trees',
  'rivers',
  'sidewalk',
  'plants',
  'grass',
];

@Injectable()
export class SeedsService {
  constructor(
    private readonly userService: UsersService,
    private readonly projectService: ProjectsService,
    private readonly prisma: PrismaService,
  ) {}

  async create(createSeedDto: CreateSeedDto) {
    await this.seedUsers(createSeedDto?.users || 0);
    return await this.seedProjects(createSeedDto?.projects || 0);
  }

  findAll() {
    return `This action returns all seeds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seed`;
  }

  update(id: number, updateSeedDto: UpdateSeedDto) {
    return updateSeedDto;
  }

  remove(id: number) {
    return `This action removes a #${id} seed`;
  }

  async seedUsers(num: number) {
    const userCreationPromises = [];

    for (let i = 0; i < num; i++) {
      const username = faker.internet.userName();
      const email = `${username}@example.com`;

      const createUserPromise = await this.userService.create({
        username: username,
        email: email,
        password: 'dummy123',
        rating: faker.number.float({ min: 20, max: 20100 }),
      });

      userCreationPromises.push(createUserPromise);
    }

    const createdUsers = await Promise.all(userCreationPromises);

    const updatePromises = createdUsers.map((user) =>
      this.userService.update(user.id, {
        imageUrl: faker.image.avatar(),
      }),
    );

    await Promise.all(updatePromises);

    const createProfilePromises = createdUsers.map((user) =>
      this.userService.updateProfile(user.id, {
        bio: faker.lorem.sentence(),
        birthDate: faker.date.past({
          years: 18,
          refDate: new Date(2002, 0, 1),
        }),
        address: faker.location.streetAddress({ useFullAddress: true }),
        phone: faker.phone.number(),
        bannerUrl: faker.image.urlLoremFlickr({ category: 'environment' }),
      }),
    );

    Logger.log('Database has been seeded with users and their profiles. 🌱');

    return await Promise.all(createProfilePromises);
  }

  async seedProjects(num: number) {
    const allUsers = await this.prisma.user.findMany();

    const donateProjects = await this.seedDonateProjects(num / 3, allUsers);
    const volunteerProjects = await this.seedVolunteerProjects(
      num / 3,
      allUsers,
    );
    const pendingProjects = await this.seedPendingProjects(num / 3, allUsers);

    const allProjects = [
      ...donateProjects,
      ...volunteerProjects,
      ...pendingProjects,
    ];

    Logger.log('Database has been seeded with cleaning projects. 🌱');

    return allProjects;
  }

  async seedDonateProjects(num: number, allUsers: UserEntity[]) {
    const createdProjects = [];

    for (let i = 0; i < num; i++) {
      const organizer = allUsers[Math.floor(Math.random() * allUsers.length)];

      const fundingGoalDeadline = faker.date.future();
      const volunteerGoalDeadline = new Date(fundingGoalDeadline);
      volunteerGoalDeadline.setDate(fundingGoalDeadline.getDate() + 7);

      const fundingGoal = faker.number.int({ min: 100000, max: 10000000 });
      const extraDonor = Math.floor(Math.random() * 20);

      const project = await this.prisma.project.create({
        data: {
          title:
            projectTitles[Math.floor(Math.random() * projectTitles.length)],
          description: faker.lorem.paragraph(),
          imageUrl: faker.image.urlLoremFlickr({
            category:
              projectImageCategories[
                Math.floor(Math.random() * projectImageCategories.length)
              ],
          }),
          fundingGoal: fundingGoal,
          fundingGoalDeadline: fundingGoalDeadline,
          volunteerGoal: faker.number.int({ min: 1, max: 20 }),
          volunteerGoalDeadline: volunteerGoalDeadline,
          address: faker.location.streetAddress({ useFullAddress: true }),
          objectives: {
            create: [
              {
                objective:
                  projectObjectives[
                    Math.floor(Math.random() * projectObjectives.length)
                  ],
                imageUrl: faker.image.urlLoremFlickr({
                  category: 'nature',
                }),
              },
            ],
          },
          requirements: {
            create: [
              {
                requirement: faker.commerce.product(),
                quantity: faker.number.int({ min: 1, max: 10 }),
              },
            ],
          },
          organizer: {
            connect: { id: organizer.id },
          },
        },
      });

      for (let j = 0; j < extraDonor; j++) {
        const randomUser =
          allUsers[Math.floor(Math.random() * allUsers.length)];
        const userId = randomUser.id;
        const createProjectDto = { ...project };
        const updateProjectDto = {
          ...createProjectDto,
          donation: {
            amount: faker.number.int({ min: 10000, max: 5000000 }),
            donatorId: userId,
          },
        };

        await this.projectService.update(project.id, updateProjectDto);
      }

      createdProjects.push(project);
    }

    return createdProjects;
  }

  async seedVolunteerProjects(num: number, allUsers: UserEntity[]) {
    const createdProjects = [];

    for (let i = 0; i < num; i++) {
      const organizer = allUsers[Math.floor(Math.random() * allUsers.length)];

      const fundingGoalDeadline = faker.date.past();

      const volunteerGoalDeadline = faker.date.future();

      const fundingGoal = faker.number.int({ min: 100000, max: 10000000 });
      const totalDonors = faker.number.int({ min: 1, max: 20 });

      const volunteerGoal = faker.number.int({ min: 1, max: 20 });

      const extraDonor = Math.floor(Math.random() * 20);
      const extraVolunteer =
        volunteerGoal > 8 ? Math.floor(Math.random() * volunteerGoal - 5) : 0;

      const project = await this.prisma.project.create({
        data: {
          title:
            projectTitles[Math.floor(Math.random() * projectTitles.length)],
          description: faker.lorem.paragraph(),
          imageUrl: faker.image.urlLoremFlickr({
            category:
              projectImageCategories[
                Math.floor(Math.random() * projectImageCategories.length)
              ],
          }),
          phase: ProjectPhaseEnum.VOLUNTEERING,
          fundingGoal: fundingGoal,
          fundingGoalDeadline: fundingGoalDeadline,
          volunteerGoal: volunteerGoal,
          volunteerGoalDeadline: volunteerGoalDeadline,
          address: faker.location.streetAddress({ useFullAddress: true }),
          objectives: {
            create: [
              {
                objective:
                  projectObjectives[
                    Math.floor(Math.random() * projectObjectives.length)
                  ],
                imageUrl: faker.image.urlLoremFlickr({
                  category: 'nature',
                }),
              },
            ],
          },
          requirements: {
            create: [
              {
                requirement: faker.commerce.product(),
                quantity: faker.number.int({ min: 1, max: 10 }),
              },
            ],
          },
          organizer: {
            connect: { id: organizer.id },
          },
        },
      });

      for (let j = 0; j < totalDonors + extraDonor; j++) {
        const randomUser =
          allUsers[Math.floor(Math.random() * allUsers.length)];
        const userId = randomUser.id;
        const createProjectDto = { ...project };
        const updateProjectDto = {
          ...createProjectDto,
          donation: {
            amount: Math.ceil(fundingGoal / totalDonors),
            donatorId: userId,
          },
        };

        await this.projectService.update(project.id, updateProjectDto);
      }

      const allUserIds = (await this.prisma.user.findMany()).map(
        (user) => user.id,
      );
      const shuffledUserIds = allUserIds.sort(() => 0.5 - Math.random());
      const selectedUserIds = shuffledUserIds.slice(0, extraVolunteer);

      for (const userId of selectedUserIds) {
        await this.prisma.projectVolunteer.create({
          data: {
            projectId: project.id,
            volunteerId: userId,
          },
        });
      }

      createdProjects.push(project);
    }

    return createdProjects;
  }

  async seedPendingProjects(num: number, allUsers: UserEntity[]) {
    const createdProjects = [];

    for (let i = 0; i < num; i++) {
      const organizer = allUsers[Math.floor(Math.random() * allUsers.length)];

      const fundingGoalDeadline = faker.date.past();
      const volunteerGoalDeadline = faker.date.past();

      const fundingGoal = faker.number.int({ min: 100000, max: 10000000 });
      const totalDonors = faker.number.int({ min: 1, max: 20 });

      const volunteerGoal = faker.number.int({ min: 1, max: 20 });

      const extraDonor = Math.floor(Math.random() * 20);
      const extraVolunteer = Math.floor(Math.random() * 20);

      const project = await this.prisma.project.create({
        data: {
          title:
            projectTitles[Math.floor(Math.random() * projectTitles.length)],
          description: faker.lorem.paragraph(),
          imageUrl: faker.image.urlLoremFlickr({
            category:
              projectImageCategories[
                Math.floor(Math.random() * projectImageCategories.length)
              ],
          }),
          phase: ProjectPhaseEnum.PENDING,
          fundingGoal: fundingGoal,
          fundingGoalDeadline: fundingGoalDeadline,
          volunteerGoal: volunteerGoal,
          volunteerGoalDeadline: volunteerGoalDeadline,
          address: faker.location.streetAddress({ useFullAddress: true }),
          objectives: {
            create: [
              {
                objective:
                  projectObjectives[
                    Math.floor(Math.random() * projectObjectives.length)
                  ],
                imageUrl: faker.image.urlLoremFlickr({
                  category: 'nature',
                }),
              },
            ],
          },
          requirements: {
            create: [
              {
                requirement: faker.commerce.product(),
                quantity: faker.number.int({ min: 1, max: 10 }),
              },
            ],
          },
          organizer: {
            connect: { id: organizer.id },
          },
        },
      });

      for (let j = 0; j < totalDonors + extraDonor; j++) {
        const randomUser =
          allUsers[Math.floor(Math.random() * allUsers.length)];
        const userId = randomUser.id;
        const createProjectDto = { ...project };
        const updateProjectDto = {
          ...createProjectDto,
          donation: {
            amount: Math.ceil(fundingGoal / totalDonors),
            donatorId: userId,
          },
        };

        await this.projectService.update(project.id, updateProjectDto);
      }

      const allUserIds = (await this.prisma.user.findMany()).map(
        (user) => user.id,
      );
      const shuffledUserIds = allUserIds.sort(() => 0.5 - Math.random());
      const selectedUserIds = shuffledUserIds.slice(
        0,
        volunteerGoal + extraVolunteer,
      );

      for (const userId of selectedUserIds) {
        await this.prisma.projectVolunteer.create({
          data: {
            projectId: project.id,
            volunteerId: userId,
          },
        });
      }

      createdProjects.push(project);
    }

    return createdProjects;
  }
}
