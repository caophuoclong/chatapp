import { Module } from '@nestjs/common';
import { UnreadService } from './unread.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnRead } from './entities/unread.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnRead])],
  providers: [UnreadService],
  exports: [UnreadService]
})
export class UnreadModule {}
