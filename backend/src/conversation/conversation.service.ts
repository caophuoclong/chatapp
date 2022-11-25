import { forwardRef, Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
import { SocketService } from '~/socket/socket.service';
import { Emoji } from '~/database/entities/Emoji';
import { Member } from '~/database/entities/member.entity';

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
    private readonly socketService: SocketService,
    @InjectRepository(Emoji)
    private readonly emojiRepository: Repository<Emoji>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}
  async getConversationFromMember(...userId: Array<string>){
    try {
      const members = await this.memberRepository.find({
        where: {
          userId: In(userId)
        },
      })
      console.log(members.length);
      const xyz : {
        [key : string]: Array<{
    _id: string;
    createdAt: number;
    isBlocked: boolean;
    isDeleted: boolean;
    deletedAt: number;
}>
      } = {}
      members.forEach(m => {
        if(!xyz[m.conversationId]){
          xyz[m.conversationId] = []
        }
        const memberDetail = {
          _id: m.userId,
          createdAt: m.createdAt,
          isBlocked: m.isBlocked,
          isDeleted: m.isDeleted,
          deletedAt: m.deletedAt,
        }
        xyz[m.conversationId].push(memberDetail);
      })
      // find object with larger than 2 members
      const conversations = Object.keys(xyz).filter(key => xyz[key].length > 1)
      console.log(conversations);
      // return a many row of member;
      // find a row with same conversationId
      // const conversations = members.map((member) => member.conversation)
      // return {
      //   statusCode: 200,
      //   message: 'success',
      //   data: conversations
      // }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }
  async createFromFriendship(
    createFromFriendShipDto: CreateConversationDtoFromFriendshipDto,
    myId: string
  ) {
    const { friendShipId } = createFromFriendShipDto;
    try {
      const friendShip = await this.friendshipService.getOne(friendShipId);
      if (friendShip) {
        const user = [friendShip.userAddress, friendShip.userRequest];
        const userId = user.map((user) => user._id);
        // await this.getConversationFromMember(...userId);
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
        const xyzt = existConversation.participants;
        // get my member row
        const myMemberRow = xyzt.find((member) => member.userId === myId);
        if(myMemberRow.isDeleted)
        this.memberRepository.save({
          ...myMemberRow,
          isDeleted: false,
          deletedAt: 0,
          createdAt: new Date().getTime() - 15 * 1000
        })
        const memberIds = xyzt.map((member) => member.userId);
        const participants = await this.userService.getUsers(memberIds);
        if (existConversation) {
          return {
            statusCode: 200,
            message: 'success',
            data: {
              ...existConversation,
              participants: participants.data,
            },
          };
        }
        const conversation =  this.conversation.create();
        conversation.lastMessage = null;
        conversation.friendship = friendShip;
        conversation.createdAt = new Date().getTime();
        const promise = [];        
        // create member
        const con = await this.conversation.save(conversation);
        // console.log("🚀 ~ file: conversation.service.ts ~ line 83 ~ ConversationService ~ user", user)
        user.forEach( (u) => {
          promise.push(
            (()=>{
              const mem = this.memberRepository.create({
                conversationId: con._id,
                conversation: con,
                userId: u._id,
                user: u
              })
              return this.memberRepository.save(mem)
            })()
          )
        })
         console.log("🚀 ~ file: conversation.service.ts ~ line 78 ~ ConversationService ~ promise", promise)

        await Promise.all(promise);
        const conver = {...con, participants: user}
        const emojis = [];
        for (let i = 0; i < user.length; i++) {
          const emoji = this.emojiRepository.create();
          emoji.conversationId = conversation._id;
          emoji.userId = user[i]._id;
          emojis.push(emoji);
        }
        await this.emojiRepository.save(emojis);

        conversation.emoji = emojis;
        user.map((user) => {
          this.socketService.emitToUser(
            user._id,
            'createConversationSuccess',
            conver,
          );
        });
        return {
          statusCode: 200,
          message: 'success',
          data: conver,
        };
      } else {
        return {
          statusCode: 404,
          message: 'friendship not found',
          data: null,
        };
      }
    } catch (error) {
      console.log("124",error);
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
        await this.userService.getUsers(
          JSON.parse(createConversationDto.participants),
        )
      ).data;
      const owner = await (await this.userService.get(ownerId)).data;
      conversation.name = createConversationDto.name;
      // conversation.participants = users;
      conversation.owner = owner;
      conversation.type = 'group';
      conversation.visible = createConversationDto.visible;
      conversation.createdAt = new Date().getTime();
      conversation.avatarUrl = createConversationDto.avatarUrl;
      const saved = await this.conversation.save(conversation);
      const emojis = [];
      for (let i = 0; i < users.length; i++) {
        const emoji = this.emojiRepository.create();
        emoji.conversationId = conversation._id;
        emoji.userId = users[i]._id;
        emojis.push(emoji);
      }
      await this.emojiRepository.save(emojis);

      conversation.emoji = emojis;
      return {
        statusCode: 200,
        message: 'create group conversation success',
        data: saved,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: 'error',
        data: error.message,
      };
    }
  }
  async getMessagesConversation(conversationId: string) {
    console.log(
      '🚀 ~ file: conversation.service.ts ~ line 122 ~ ConversationService ~ getMessagesConversation ~ conversationId',
      conversationId,
    );
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
  async getConversationById(slug: string) {
    try {
      const conversation = await this.conversation.findOne({
        where: { _id: slug },
        relations: {
          lastMessage: true,
          owner: true,
          friendship: true,
        }
      });

      const participants = await this.getUserOfConversation(conversation._id);
      return {
        statusCode: 200,
        message: 'success',
        data: {
          ...conversation,
          participants: participants.data
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'error',
        data: error.message,
      };
    }
  }
  async getConversationType(conversationId: string) {
    try{
      const conversation = await this.conversation.findOne({
        where:{
          _id: conversationId
        }
      })
      if(!conversation){
        return null;
      }
      return conversation.type;

    }catch(error){
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getUserOfConversation(
    conversationId: string,
    perpage: number = 5,
    page: number = 0,
  ) {
    try {
      const type = await this.getConversationType(conversationId);
      const participants = await this.user
        .createQueryBuilder('user')
        .innerJoin('member', 'member', 'member.userId = user._id')
        .where('member.conversationId = :id', { id: conversationId })
        .limit(type === 'group' ? perpage : 2)
        .skip(type === 'group' ? page * perpage : 0)
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
              (con) => !users.find((us) => us._id === con.user._id),
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
    const index = conversation.participants.findIndex((p) => p.user._id === _id);
    if (index === -1) {
      return {
        statusCode: 400,
        message: 'user is not in conversation',
        data: null,
      };
    }
    conversation.participants = conversation.participants.filter(
      (con) => con.user._id !== _id,
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
  async getEmoji(slug: string, userId: string){
    try{
      const conversation = await this.conversation.findOne({where:{_id:slug},
      relations: {
        emoji: {
          userId: true
        }
      }})
      if(!conversation){
        return {
          statusCode: 404,
          message: 'conversation not found',
          data: null,
        };
      }
      const emoji = conversation.emoji.filter(e => (e.userId as User)._id === userId)
      const emo = {
        ...emoji[0]
      }
      emo.userId = (emoji[0].userId as User)._id
      return{
        statusCode:200,
        message:'get emoji success',
        data: emo
      }

    }catch(error){
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      };
    }
  }
  async updateEmoji(slug: string, userId: string, emoji: Emoji){
    console.log(emoji);
    try{
      const foundEmoji = await this.emojiRepository.findOne({
        where:{
          _id: emoji._id,
        },
        relations:{
          userId: true,
          conversationId: true
        }
      })
      if(!foundEmoji){
        return {
          statusCode: 404,
          message: 'emoji not found',
          data: null,
        };
      }
      if((foundEmoji.userId as User)._id !== userId || (foundEmoji.conversationId as Conversation)._id !== slug){
        return {
          statusCode: 403,
          message: 'you are not permitted to do this action',
          data: null,
        };
      }
      foundEmoji.emoji = emoji.emoji;
      await this.emojiRepository.save(foundEmoji);
      // const emoji1 = {
      //   ...foundEmoji,
      //   emoji: emoji.emoji,
      //   userId: (foundEmoji.userId as User)._id,
      //   conversationId: (foundEmoji.conversationId as Conversation)._id
      // }
      return{
        statusCode:200,
        message:'update emoji success',
        // data: emoji1
      }
    }catch(error){
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      };
    }

  }
  async removeConversation(slug: string, userId: string){
    // query conversation by id
    // const conversation = await this.conversation.findOne({
    //   where: {
    //     _id: slug,
    //   },
    //   relations: {
    //     owner: true,
    //     participants: true,
    //     blockBy: true,
    //   },
    // });
    let member = await this.memberRepository.findOne({
      where:{
        conversationId: slug,
        userId: userId
      },
      relations:{
        conversation: {
          owner: true,
        },
        user: true
      }
    })
    
    if (!member) {
      return {
        statusCode: 404,
        message: 'conversation not found',
        data: null,
      };
    }
    const conversation = member.conversation;
    if (conversation.type === 'group' && conversation.owner._id === userId) {
      await this.conversation.delete({
        _id: conversation._id
      });
      return {
        statusCode: 200,
        message: 'delete conversation success',
        data: null,
      }
    }
    member.isDeleted = true;
    member.deletedAt = new Date().getTime();
    await this.memberRepository.save(member);
    return {
      statusCode: 200,
      message: 'out conversation success',
      // data: conversation,
    } 
  }

}
