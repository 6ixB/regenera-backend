import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ProjectEntity } from 'src/projects/entities/project.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async search(query: string, page: number, limit: number) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [{ username: { contains: query, mode: 'insensitive' } }],
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const projects = await this.prisma.project.findMany({
      where: {
        OR: [{ title: { contains: query, mode: 'insensitive' } }],
      },
      include: { organizer: true },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      users: users.map((user) => new UserEntity(user)),
      usersTotal: users.length,
      projects: projects.map((project) => new ProjectEntity(project)),
      projectsTotal: projects.length,
    };
  }
}
