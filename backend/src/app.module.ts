import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket.gateway';
import { UserModule } from './user/user.module';
import { config, databaseConfig } from './configs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { Status } from './entities/status.entity';
import { FriendShip } from './friendship/entities/friendship.entity';
import { Conversation } from './conversation/entities/conversation.entity';
import { Message } from './message/entities/message.entity';
import { FriendshipModule } from './friendship/friendship.module';
import { AttachmentModule } from './attachment/attachment.module';
import { UnreadModule } from './unread/unread.module';
import { UnRead } from './unread/entities/unread.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, config]
    }),
    TypeOrmModule.forRootAsync({
    useFactory: () => {
      const config = databaseConfig();
      return {
        type: 'mysql',
        host: config.host,
        port: +config.port,
        username: config.user,
        password: config.password,
        database: config.database,
        entities: [User, Status, FriendShip, Conversation, Message, UnRead],
        autoLoadEntities: true,
        synchronize: true

      }
    },
  }),UserModule, ConversationModule, MessageModule, FriendshipModule, AttachmentModule, UnreadModule],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
