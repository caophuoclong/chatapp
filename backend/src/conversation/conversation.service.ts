import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateConversationDtoFromFriendshipDto } from './dto/create-conversation-friend';
import {
  ArrayContainedBy,
  ArrayContains,
  DataSource,
  getManager,
  In,
  Repository,
} from 'typeorm';
import { FriendShip } from '../friendship/entities/friendship.entity';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { FriendshipService } from '~/friendship/friendship.service';
import { Conversation } from './entities/conversation.entity';
import moment from 'moment';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    @InjectRepository(FriendShip)
    private readonly friendShip: Repository<FriendShip>,
    @InjectRepository(Conversation)
    private readonly conversation: Repository<Conversation>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly friendshipService: FriendshipService,
  ) {}
  async createFromFriendship(
    createFromFriendShipDto: CreateConversationDtoFromFriendshipDto,
  ) {
    const { friendShipId } = createFromFriendShipDto;
    console.log(friendShipId);
    try {
      const friendShip = await this.friendshipService.getOne(friendShipId);
      if (friendShip) {
        const user = [friendShip.userAddress, friendShip.userRequest];

        // check if two  user are in conversation exist
        const existConversation = await this.conversation.findOne({
          relations: {
            participants: true,
            lastMessage: true,
            friendship: {
              userAddress: true,
              userRequest: true,
              statusCode: true,
            },
          },
          where: {
            friendship: friendShip,
          },
        });
        if (existConversation) {
          console.log(existConversation._id);
          return {
            statusCode: 200,
            message: 'success',
            data: existConversation,
          };
        }
        const conversation = await this.conversation.create();
        conversation.participants = user;
        conversation.lastMessage = null;
        conversation.friendship = friendShip;
        conversation.createdAt = new Date().getTime();
        const con = await this.conversation.save(conversation);
        return {
          statusCode: 200,
          message: 'success',
          data: con,
        };
      } else {
        return {
          statusCode: 404,
          message: 'friendship not found',
          data: null,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'error',
        data: error.message,
      };
    }
  }
  async create(ownerId: string, createConversationDto: CreateConversationDto) {
    try {
      // console.log(ownerId);
      // console.log(createConversationDto.participants);
      const conversation = this.conversation.create();
      const users = await (
        await this.userService.getUsers(createConversationDto.participants)
      ).data;
      const owner = await (await this.userService.get(ownerId)).data;
      conversation.name = createConversationDto.name;
      conversation.participants = users;
      conversation.owner = owner;
      conversation.type = 'group';
      conversation.visible = createConversationDto.visible;
      conversation.createdAt = new Date().getTime();

      const saved = await this.conversation.save(conversation);
      return {
        statusCode: 200,
        message: 'create group conversation success',
        data: saved,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'error',
        data: error.message,
      };
    }
  }
  async getMessagesConversation(conversationId: string) {
    try {
      const conversation = await this.conversation.findOne({
        where: {
          _id: conversationId,
        },
        relations: {
          messages: {
            sender: true,
          },
        },
      });
      if (!conversation)
        return {
          statusCode: 404,
          message: 'conversation not found',
          data: null,
        };
      else {
        return {
          statusCode: 200,
          message: 'success',
          data: conversation.messages,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      };
    }
  }
  async getParticipants(conversationId: string) {
    try {
      const conversation = await this.conversation.findOne({
        where: {
          _id: conversationId,
        },
        relations: {
          participants: true,
        },
      });
      if (!conversation)
        return {
          statusCode: 404,
          message: 'conversation not found',
          data: null,
        };
      else {
        return {
          statusCode: 200,
          message: 'success',
          data: conversation.participants,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      };
    }
  }
  async getOwnerConversation(conversationId: string) {}
  async getConversationById(conversationId: string) {
    try {
      const conversation = await this.conversation.findOne({
        where: { _id: conversationId },
      });

      return {
        statusCode: 200,
        message: 'success',
        data: conversation,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'error',
        data: error.message,
      };
    }
  }
  async getUserOfConversation(
    conversationId: string,
    type: 'group' | 'direct',
    perpage: number = 5,
    page: number = 0,
  ) {
    try {
      const participants = await this.user
        .createQueryBuilder('user')
        .innerJoin("isMember", "iM", "iM.user_id = user._id")
        .where("iM.conversation_id = :id", { id: conversationId })
        .limit(type === "group" ? perpage : 2)
        .skip(type === "group" ? page * perpage : 0)
        .getMany();
      return {
        data: participants,
      };
    } catch (error) {
      console.log(error.message);
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      };
    }
  }
  async updateConversation(
    _id: string,
    updateConversationDto: UpdateConversationDto,
    slug: string,
  ) {
    try {
      const user = await this.user.findOne({
        where: {
          _id: _id,
        },
      });
      const conversation = await this.conversation.findOne({
        where: {
          _id: slug,
        },
        relations: {
          participants: true,
          owner: true,
          blockBy: true,
        },
      });
      if (!conversation)
        return {
          statusCode: 404,
          message: 'conversation not found',
          data: null,
        };
      // Direct message only change blocked or not
      if (conversation.type === 'direct') {
        if (updateConversationDto.isBlocked !== undefined) {
          conversation.isBlocked = updateConversationDto.isBlocked;
        }
        if (conversation.isBlocked) {
          conversation.blockBy = user;
        } else {
          conversation.blockBy = null;
        }
      } else {
        // This action can be done by owner only
        if (_id === conversation.owner._id) {
          if (updateConversationDto.name) {
            conversation.name = updateConversationDto.name;
          }
          if (updateConversationDto.visible) {
            conversation.visible = updateConversationDto.visible;
          }
          // Check if user is in conversation, if not add user to conversation
          if (updateConversationDto.participants) {
            const users = await this.user.find({
              where: {
                _id: In(updateConversationDto.participants.map((u) => u)),
              },
            });
            const uniq = (a) => {
              let seen = {};
              return a.filter(function (item) {
                var k = JSON.stringify(item);
                return seen.hasOwnProperty(k) ? false : (seen[k] = true);
              });
            };
            conversation.participants = uniq([
              ...conversation.participants,
              ...users,
            ]);
          }
          // Check if user is in conversation, if has remove user from conversation
          if (updateConversationDto.removeParticipants) {
            const ownerId = conversation.owner._id;
            if (updateConversationDto.removeParticipants.includes(ownerId)) {
              return {
                statusCode: 400,
                message: 'you can not remove owner from conversation',
                data: null,
              };
            }
            const users = await this.user.find({
              where: {
                _id: In(updateConversationDto.removeParticipants.map((u) => u)),
              },
            });
            conversation.participants = conversation.participants.filter(
              (con) => !users.find((us) => us._id === con._id),
            );
          }
        } else {
          return {
            statusCode: 403,
            message: 'you are not permitted to do this action',
            data: null,
          };
        }
      }
      return {
        statusCode: 200,
        message: 'update conversation success',
        data: await this.conversation.save(conversation),
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'error',
        data: error.message,
      };
    }
  }
  async outConversation(_id: string, slug: string) {
    const conversation = await this.conversation.findOne({
      where: {
        _id: slug,
      },
      relations: {
        owner: true,
        participants: true,
      },
    });
    if (conversation.type === 'direct') {
      return {
        statusCode: 400,
        message: 'you can not out direct conversation',
        data: null,
      };
    }
    if (!conversation) {
      return {
        statusCode: 404,
        message: 'conversation not found',
        data: null,
      };
    }

    if (conversation.owner._id === _id) {
      return {
        statusCode: 400,
        message: 'you can not out from conversation',
        data: null,
      };
    }
    // check if id is in conversation
    const index = conversation.participants.findIndex((p) => p._id === _id);
    if (index === -1) {
      return {
        statusCode: 400,
        message: 'user is not in conversation',
        data: null,
      };
    }
    conversation.participants = conversation.participants.filter(
      (con) => con._id !== _id,
    );
    await this.conversation.save(conversation);
    return {
      statusCode: 200,
      message: 'out conversation success',
      data: null,
    };
  }
  async deleteConversation(_id: string, slug: string) {
    const conversation = await this.conversation.findOne({
      where: {
        _id: slug,
      },
      relations: {
        owner: true,
      },
    });
    if (!conversation) {
      return {
        statusCode: 404,
        message: 'conversation not found',
        data: null,
      };
    }
    if (conversation.type === 'group' && conversation.owner._id !== _id) {
      return {
        statusCode: 403,
        message: 'you are not permitted to do this action',
        data: null,
      };
    }
    conversation.isDeleted = true;
    conversation.deletedAt = new Date().getTime();
    await this.conversation.save(conversation);
    return {
      statusCode: 200,
      message: 'delete conversation success',
      data: null,
    };
  }
  async getListConversationsById(id: string[]) {
    try {
      const response = await this.conversation.find({
        where: {
          _id: In(id),
        },
        relations: {
          participants: true,
          owner: true,
          blockBy: true,
        },
      });
      return response;
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      };
    }
  }
}
