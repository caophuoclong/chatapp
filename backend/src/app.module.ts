import { PassportModule } from '@nestjs/passport';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
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
import { AuthvalidationMiddleware } from './authvalidation.middleware';
import { LocalStrategy } from '~/auth/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { Attachment } from './attachment/entities/attachment.entity';
import { TestModule } from './test/test.module';
import { MessageGateway } from './message.gateway';
import * as redisStore from 'cache-manager-redis-store';
import { redisConfig } from './configs/index';
import { PasswordResetToken } from './entities/passResetToken.entity';
import { RedisModule } from './redis.module';

@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, config, redisConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const config = databaseConfig();
        return {
          type: 'mysql',
          host: config.database_host,
          port: +config.database_port,
          username: config.database_user,
          password: config.database_password,
          database: config.database_database,
          entities: [
            User,
            Status,
            FriendShip,
            Conversation,
            Message,
            UnRead,
            Attachment,
            PasswordResetToken,
          ],
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    UserModule,
    MessageModule,
    ConversationModule,
    AttachmentModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: config().jwtSecret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    SocketGateway,
    MessageGateway,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //   .apply(AuthvalidationMiddleware)
  //   .exclude("/api/user/login", "/api/user/register")
  //   .forRoutes("*")
  // }
}
