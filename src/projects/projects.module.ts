import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [PrismaModule],
  exports: [ProjectsService]
})
export class ProjectsModule {}
