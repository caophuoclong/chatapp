import { Injectable, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stringify } from 'querystring';
import { Repository } from 'typeorm';
import { SocketService } from '~/socket/socket.service';
import { User } from '~/user/entities/user.entity';
import { FriendShip } from './entities/friendship.entity';
import { Status } from '../database/entities/status.entity';
import { filteredFriendships } from '~/interfaces/IListFriend';
import { FriendShipStatus } from '../constants/socketEvent';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(FriendShip)
    private readonly friendShip: Repository<FriendShip>,
    @InjectRepository(User)
    private readonly user: Repository<User>,
    private readonly socket: SocketService
  ) {}
  async create(requestId: string, addressId: string, status: Status = FriendShipStatus.PENDING) {
    try {
      //  Check exist friendship
      const isFriendShip = await this.getFriendShip(requestId, addressId);
      if (isFriendShip) {
        return {
          ...isFriendShip
        };
      } 
      const newFriendShip = this.friendShip.create();
      newFriendShip.userAddress._id = addressId;
      newFriendShip.userRequest._id = requestId;
      newFriendShip.status = FriendShipStatus.PENDING
      const friendShip = await this.friendShip.save(newFriendShip);
      return friendShip;
      
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async getOne(_id: string){
    return this.friendShip.findOne({
      where:{
        _id
      },
      relations: {
        userAddress: true,
        userRequest: true
      }
    })
  }
  async getUsersFromFriendship(_id: string){
    return this.getOne(_id);
  }
  private async validFriendShip(requestId: string, friendShipId: string){
    const friendship = await this.getUsersFromFriendship(friendShipId);
    if(!friendship) throw new NotFoundException("Not found friendship");
    const users = [friendship.userAddress, friendship.userRequest];
    if(users.some(user => user._id === requestId)){
      throw new ForbiddenException()
    }
    return friendship;
  }
  async removeFriend(requestId: string, friendShipId: string) {
   try{
    const friendship = await this.validFriendShip(requestId, friendShipId);
    await this.friendShip.delete(friendship);
    return {
      message: "Remove friend successfully"
    }
   }catch(error){
    throw new InternalServerErrorException(error.message)
   }
  }
  async updateFriendShip(friendship: FriendShip, status: Status){
    friendship.status = status;
    return this.friendShip.save(friendship)
  }
  async acceptFriend(requestId: string, friendShipId: string) {
    try {
      const friendship = await this.validFriendShip(requestId, friendShipId);
      if(friendship.userAddress._id !== requestId) throw new ForbiddenException();
      return await this.updateFriendShip(friendship, FriendShipStatus.ACCEPT);
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  async rejectFriend(requestId: string, friendShipId: string) {
    return this.removeFriend(requestId, friendShipId);
  }
  async blockFriend(requestId: string, friendShipId: string) {
    try {
      const friendship = await this.validFriendShip(requestId, friendShipId);
      return await this.updateFriendShip(friendship, FriendShipStatus.BLOCK);
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  async blockUser(requestId: string, addressId: string){
    return this.create(requestId, addressId, FriendShipStatus.BLOCK)
  }
  async getFriendShip(...params: Array<string>){
    return this.friendShip.findOne({
      where:[
        {
          userRequest: {
            _id: params[0]
          },
          userAddress: {
            _id: params[1]
          },
        },{
          userRequest: {
            _id: params[1]
          },
          userAddress: {
            _id: params[0]
          },
        }
      ],
      relations:["userRequest", "userAddress", "status"],
    })
  }
  async getFriends(userId: string){
    const friendShip = await this.friendShip.find({
      where:[
        {
          userRequest:{
            _id: userId
          },
        },{
          userAddress: {
            _id: userId
          }
        }
      ],
      relations:["status", "userAddress", "userRequest"]
    })
    
    const filteredFriendShips : Array<filteredFriendships> = friendShip.map((value, index)=>{
      const {userAddress, userRequest, ...x} = value;
      return {
        ...x,
        user: userId === userAddress._id ? userRequest : userAddress,
        flag: userId === userAddress._id ? "target" : "sender"
      }
    });
    return filteredFriendShips;
  }
}
