import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '~/auth/auth.module';
import { ConversationModule } from '~/conversation/conversation.module';
import { Member } from '~/database/entities/member.entity';
import { FriendshipModule } from '~/friendship/friendship.module';
import { MessageModule } from '~/message/message.module';
import { RedisModule } from '~/redis.module';
import { SocketModule } from '~/socket/socket.module';
import { UserModule } from '~/user/user.module';
import { FriendShipGateway } from './friendship.gateway';
import { MessageGateway } from './message.gateway';

@Module({
    imports: [
        UserModule,
        MessageModule,
        ConversationModule,
        RedisModule,
        FriendshipModule,
        AuthModule,
        TypeOrmModule.forFeature([Member])
    ],
    providers: [MessageGateway, FriendShipGateway]
})
export class GatewayModule {}
