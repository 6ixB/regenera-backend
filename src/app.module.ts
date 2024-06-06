import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { FirebaseModule } from 'nestjs-firebase';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
    }),
    FirebaseModule.forRoot({
      googleApplicationCredential: './serviceAccountKey.json',
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
