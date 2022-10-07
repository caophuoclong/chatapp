import { Module } from '@nestjs/common';
import { RedisModule } from '~/redis.module';
import { SocketService } from './socket.service';

@Module({
  imports: [RedisModule],
  providers: [SocketService],
  exports: [SocketService]
})
export class SocketModule {}
