import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { FirebaseModule } from 'nestjs-firebase';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProjectsModule,
    FirebaseModule.forRoot({
      googleApplicationCredential: 'serviceAccountKey.json',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
