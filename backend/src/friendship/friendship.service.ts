import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendShip } from './entities/friendship.entity';

@Injectable()
export class FriendshipService {
    constructor(@InjectRepository(FriendShip) private readonly friendShip: Repository<FriendShip>){}
}
