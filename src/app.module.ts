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
import { SearchModule } from './search/search.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { ChatModule } from './chat/chat.module';
import { ChatRoomRelationModule } from './chat-room-relation/chat-room-relation.module';

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
    SearchModule,
    ChatRoomModule,
    ChatModule,
    ChatRoomRelationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
