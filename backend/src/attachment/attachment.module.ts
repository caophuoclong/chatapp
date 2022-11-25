import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { Attachment } from '~/attachment/entities/attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment])],
  providers: [AttachmentService],
  exports: [AttachmentService]
})
export class AttachmentModule {}
