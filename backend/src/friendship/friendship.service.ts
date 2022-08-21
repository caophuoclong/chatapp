import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stringify } from 'querystring';
import { Repository } from 'typeorm';
import { User } from '~/user/entities/user.entity';
import { FriendShip } from './entities/friendship.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(FriendShip)
    private readonly friendShip: Repository<FriendShip>,
  ) {}
  async addFreiend(requestId: string, addressId: string) {
    try {
      const friendship = {
        userRequest: {
          _id: requestId,
        },
        userAddress: {
          _id: addressId,
        },
        statusCode: {
          code: 'p',
        },
      };
      this.friendShip.create(friendship);
      await this.friendShip.save(friendship);
      return {
        statusCode: 200,
        message: 'Friendship created successfully',
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  async removeFriend(requestId: string, friendShipId: number) {
    const friendship = await this.friendShip.findOne({
      where: { _id: friendShipId },
      relations: {
        statusCode: true,
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
          statusCode: 200,
          message: 'Friendship deleted successfully',
        };
      } else {
        return {
          statusCode: 403,
          message: 'You are not allowed to delete this friendship',
        };
      }
    }
    return {
      statusCode: 404,
      message: 'Friendship not found',
    };
  }
  async acceptFriend(requestId: string, friendShipId: number) {
    try {
      const friendShip = await this.friendShip.findOne({
        where: {
          _id: friendShipId,
        },
        relations: ['statusCode', 'userRequest', 'userAddress'],
      });
      if (friendShip) {
        const x = {
          _id: friendShipId,
          userRequest: (friendShip.userRequest as User)._id,
          userAddress: (friendShip.userAddress as User)._id,
        };
        if (x.userAddress === requestId || x.userRequest === requestId) {
          friendShip.statusCode.code = 'a';
          await this.friendShip.save(friendShip);
          return {
            statusCode: 200,
            message: 'Friendship accepted successfully',
          };
        } else {
          return {
            statusCode: 403,
            message: 'You are not allowed to accept this friendship',
          };
        }
      }
      return {
        statusCode: 404,
        message: 'Friendship not found',
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  async rejectFriend(requestId: string, friendShipId: number) {
    try {
      const friendShip = await this.friendShip.findOne({
        where: {
          _id: friendShipId,
        },
        relations: ['statusCode', 'userRequest', 'userAddress'],
      });
      if (friendShip) {
        const x = {
          _id: friendShipId,
          userRequest: (friendShip.userRequest as User)._id,
          userAddress: (friendShip.userAddress as User)._id,
        };
        if (x.userAddress === requestId || x.userRequest === requestId) {
          friendShip.statusCode.code = 'r';
          await this.friendShip.save(friendShip);
          return {
            statusCode: 200,
            message: 'Friendship accepted successfully',
          };
        } else {
          return {
            statusCode: 403,
            message: 'You are not allowed to accept this friendship',
          };
        }
      }
      return {
        statusCode: 404,
        message: 'Friendship not found',
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  async blockFriend(requestId: string, friendShipId: number) {
    try {
      const friendship = await this.friendShip.findOne({
        where: {
          _id: friendShipId,
        },
        relations: ['statusCode', 'userRequest', 'userAddress'],
      });
      if (friendship) {
        const x = {
          _id: friendShipId,
          userRequest: (friendship.userRequest as User)._id,
          userAddress: (friendship.userAddress as User)._id,
        };
        if (x.userAddress === requestId || x.userRequest === requestId) {
          friendship.statusCode.code = 'b';
          await this.friendShip.save(friendship);
          return {
            statusCode: 200,
            message: 'Friendship blocked successfully',
          };
        } else {
          return {
            statusCode: 403,
            message: 'You are not allowed to block this friendship',
          };
        }
      }
      return {
        statusCode: 404,
        message: 'Friendship not found',
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
//   async getFriendShip(user1: string, user2: string) {
//     try {
//         let friendship = await this.friendShip.findOne({
//             where: {
//                 userRequest_id: user1,
//                 userAddress_id: user2,
//             }
//         })
//         if(!friendship){
//             friendship = await this.friendShip.findOne({
//                 where: {
//                     userRequest: user2,
//                     userAddress: user1,
//                 }
//             })
//             if(!friendship){
//                 return {
//                     statusCode: 404,
//                     message: 'Friendship not found',
//                 }
//             }else{
//                 return {
//                     statusCode: 200,
//                     message: 'Friendship found',
//                     friendship: friendship,
//                 }
//             }
//         }
//     } catch (error) {
//       return {
//         message: error.message,
//       };
//     }
//   }
}
