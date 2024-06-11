import { Module, Post } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { SeedsController } from './seeds.controller';
import { PrismaModule } from 'nestjs-prisma';
import { UsersModule } from 'src/users/users.module';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  controllers: [SeedsController],
  providers: [SeedsService],
  imports: [PrismaModule, UsersModule, ProjectsModule],
})
export class SeedsModule {}
