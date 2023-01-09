import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stringify } from 'querystring';
import { Repository } from 'typeorm';
import { SocketService } from '~/socket/socket.service';
import { User } from '~/user/entities/user.entity';
import { FriendShip } from './entities/friendship.entity';
import { Status } from '../database/entities/status.entity';
import { filteredFriendships } from '~/interfaces/IListFriend';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(FriendShip)
    private readonly friendShip: Repository<FriendShip>,
    @InjectRepository(User)
    private readonly user: Repository<User>,
    private readonly socket: SocketService
  ) {}
  async addFreiend(requestId: string, addressId: string) {
    try {
      //  Check exist friendship
      const isFriendShip = await this.friendShip
        .createQueryBuilder()
        .where({
          userRequest: requestId,
          userAddress: addressId,
        })
        .getOne()
      if (isFriendShip) {
        return {
          status: 200,
          message: 'Already existed friend ship with _id',
          _id: isFriendShip._id,
        };
      } else {
        const isFriendShip = await this.friendShip
          .createQueryBuilder()
          .where({
            userRequest: addressId,
            userAddress: requestId,
          })
          .getOne();
        if (isFriendShip) {
          return {
            status: 200,
            message: 'Already existed friend ship with _id',
            _id: isFriendShip._id,
          };
        } else {
          const user1 = this.user.findOne({
            where: {
              _id: requestId,
            }
          })
          const user2 = this.user.findOne({
            where: {
              _id: addressId,
            }
          })
          
          const [userRequest, userAddress] = await Promise.all([user1, user2]);
          const friendship = {
            userRequest,
            userAddress,
            status: {
              code: 'p',
              name: 'Pending',
            },
          };
          this.friendShip.create(friendship);
          await this.friendShip.save(friendship);
          this.socket.emitToUser(addressId, 'createFriendShipSuccess', friendship);
          return {
            status: 200,
            message: 'Friendship created successfully',
            friendShip: friendship,
          };
        }
      }
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  async removeFriend(requestId: string, friendShipId: string) {
    const friendship = await this.friendShip.findOne({
      where: { _id: friendShipId },
      relations: {
        status: true,
        userRequest: true,
        userAddress: true,
      },
    });
    if (friendship) {
      const x = {
        _id: friendShipId,
        userRequest: (friendship.userRequest as User)._id,
        userAddress: (friendship.userAddress as User)._id,
      };
      if (x.userAddress === requestId || x.userRequest === requestId) {
        await this.friendShip.delete(friendShipId);
        return {
          status: 200,
          message: 'Friendship deleted successfully',
        };
      } else {
        return {
          status: 403,
          message: 'You are not allowed to delete this friendship',
        };
      }
    }
    return {
      status: 404,
      message: 'Friendship not found',
    };
  }
  async acceptFriend(requestId: string, friendShipId: string) {
    try {
      const friendShip = await this.friendShip.findOne({
        where: {
          _id: friendShipId,
        },
        relations: ['status', 'userRequest', 'userAddress'],
      });
      if (friendShip) {
        const x = {
          _id: friendShipId,
          userRequest: (friendShip.userRequest as User)._id,
          userAddress: (friendShip.userAddress as User)._id,
        };
        if (x.userAddress === requestId || x.userRequest === requestId) {
          friendShip.status.code = 'a';
          await this.friendShip.save(friendShip);
          this.socket.emitToUser(x.userRequest, 'onAcceptFriend', friendShip);
          return {
            status: 200,
            message: 'Friendship accepted successfully',
          };
        } else {
          return {
            status: 403,
            message: 'You are not allowed to accept this friendship',
          };
        }
      }
      return {
        status: 404,
        message: 'Friendship not found',
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  async rejectFriend(requestId: string, friendShipId: string) {
    try {
      const friendShip = await this.friendShip.findOne({
        where: {
          _id: friendShipId,
        },
        relations: ['status', 'userRequest', 'userAddress'],
      });
      if (friendShip) {
        const x = {
          _id: friendShipId,
          userRequest: (friendShip.userRequest as User)._id,
          userAddress: (friendShip.userAddress as User)._id,
        };
        if (x.userAddress === requestId || x.userRequest === requestId) {
          friendShip.status.code = 'r';
          await this.friendShip.save(friendShip);
          return {
            status: 200,
            message: 'Friendship accepted successfully',
          };
        } else {
          return {
            status: 403,
            message: 'You are not allowed to accept this friendship',
          };
        }
      }
      return {
        status: 404,
        message: 'Friendship not found',
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  async blockFriend(requestId: string, friendShipId: string) {
    try {
      const friendship = await this.friendShip.findOne({
        where: {
          _id: friendShipId,
        },
        relations: ['status', 'userRequest', 'userAddress'],
      });
      if (friendship) {
        const x = {
          _id: friendShipId,
          userRequest: (friendship.userRequest as User)._id,
          userAddress: (friendship.userAddress as User)._id,
        };
        if (x.userAddress === requestId || x.userRequest === requestId) {
          friendship.status.code = 'b';
          await this.friendShip.save(friendship);
          return {
            status: 200,
            message: 'Friendship blocked successfully',
          };
        } else {
          return {
            status: 403,
            message: 'You are not allowed to block this friendship',
          };
        }
      }
      return {
        status: 404,
        message: 'Friendship not found',
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  async getFriendShipById(_id: string){
    return this.friendShip.findOne({
      where: {
        _id
      },
      relations: ["status", "userAddress", "userRequest"]
    })
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
