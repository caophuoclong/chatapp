import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnRead } from './entities/unread.entity';

@Injectable()
export class UnreadService {
    constructor(
        @InjectRepository(UnRead)
        private readonly unreadRepository: Repository<UnRead>,
    ) {}
}
