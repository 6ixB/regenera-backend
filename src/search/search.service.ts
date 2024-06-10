import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
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

    return { users };
  }
}
