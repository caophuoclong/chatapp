import {
  forwardRef,
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateConversationDtoFromFriendshipDto } from './dto/create-conversation-friend';
import { ArrayContainedBy, ArrayContains, DataSource, getManager, In, Repository } from 'typeorm';
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
import { roomConversation } from '../socket/socket.service';
import { MemberService } from '~/member/member.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
interface MemberDetails {}
@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversation: Repository<Conversation>,
    @Inject(forwardRef(()=> UserService))
    private readonly userService: UserService,
    private readonly friendshipService: FriendshipService,
    @InjectRepository(Emoji)
    private readonly emojiRepository: Repository<Emoji>,
    private readonly memberService: MemberService,
  ) {}
  async getMany(userId: string){
    const response = await this.memberService.getConversationByMember(userId);
    return response;
  }
  getMembers(conversationId: string){
    return this.memberService.getMembers(conversationId);
  }
  private  createMember(users: Array<Partial<User>>, conversation: Partial<Conversation>){
    return Promise.all(users.map(u => this.memberService.create({_id: u._id}, {_id: conversation._id})))
  }
  private createEmojis(users: Array<Partial<User>>, conversation: Partial<Conversation>){
     return Promise.all(users.map(async (user)=>{
        const newEmoji = this.emojiRepository.create();
        newEmoji.conversation._id = conversation._id;
        newEmoji.user._id = user._id;
        const {conversation: co, ...result } = await this.emojiRepository.save(newEmoji);
        return result
      }))
  }
  async getAgainConversation(userId: string, conversationId: string){
    const member = await this.memberService.getOne({_id: userId}, {_id: conversationId});
    if(!member) throw new NotFoundException("Not found conversation");
    const recovered = await this.memberService.recoverMember({_id: userId}, {_id: conversationId})
    return {
      ...member.conversation,
      members: member.conversation.members.map(m => {
        delete m.conversation;
        if(m.user._id === recovered.user._id){
          delete recovered.conversation;
          return recovered
        }
        return m;
      })
    }
  }
  async createFromFriendship(createFromFriendShipDto: CreateConversationDtoFromFriendshipDto, myId: string) {
    const { friendShipId } = createFromFriendShipDto;
    try {
      const friendShip = await this.friendshipService.getOne(friendShipId);
      if(!friendShip) throw new NotFoundException("Not found friendShip");
        const isExistConversation = await this.getOne({friendShipId});
        if(!isExistConversation) throw new NotFoundException("Could not found conversation");
        const users = [friendShip.userAddress, friendShip.userRequest];
        const member = await this.memberService.getOne({_id: myId}, {_id: isExistConversation._id})
        if(member.isDeleted){
          await this.memberService.recoverMember({_id: myId}, {_id: isExistConversation._id});
          return isExistConversation;
        }
        // } else {
          const newConversation = this.conversation.create();
          newConversation.friendship = friendShip;
          const conversation = await this.conversation.save(newConversation);
          const members = await this.createMember(users, conversation);
          const emojis = await this.createEmojis(users, conversation);
          return {
            ...conversation,
            participants: members,
            emojis:emojis
          };
    } catch (error) {
      console.log('124', error);
      return {
        status: 500,
        message: 'error',
        data: error.message,
      };
    }
  }
  async create(ownerId: string, { participants, name, visible, avatarUrl }: CreateConversationDto) {
    try {
      const conversation = this.conversation.create();
      const users = await Promise.all(
        participants.map((_id) =>
          this.userService.getOne({
            _id,
          }),
        ),
      );
      conversation.name = name;
      conversation.owner._id = ownerId;
      conversation.type = 'group';
      conversation.visible = visible;
      conversation.avatarUrl = avatarUrl;
      const saved = await this.conversation.save(conversation);
      const emojis = await this.createEmojis(users, conversation);
      const members = await this.createMember(users, conversation);
      return {
        ...saved,
        members: members,
        emojis: emojis
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'error',
        data: error.message,
      };
    }
  }
  async getOne({
    _id,
    friendShipId,
  }: Partial<{
    _id: string;
    friendShipId: string;
  }>) {
    try {
      const conversation = await this.conversation.findOne({
        where: [
          { _id },
          {
            friendship: {
              _id: friendShipId,
            },
          },
        ],
        relations: {
          lastMessage: true,
          owner: true,
        },
      });
      if (!conversation) throw new NotFoundException('Not found conversation');
      const members = await this.memberService.getMembers(conversation._id);
      return {
        ...conversation,
        members: members,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async updateConversation(userId: string, updateConversationDto: UpdateConversationDto, conversationId: string) {
    try {
      const isExistConversation = await this.memberService.getOne({_id: userId}, {_id: conversationId});
      if(!isExistConversation) throw new NotFoundException("Not found conversation");
      // const user = await this.user.findOne({
      //   where: {
      //     _id: _id,
      //   },
      // });
      // const conversation = await this.conversation.findOne({
      //   where: {
      //     _id: slug,
      //   },
      //   relations: {
      //     members: true,
      //     owner: true,
      //     blockBy: true,
      //   },
      // });

      // Direct message only change blocked or not
      const {conversation, user} = isExistConversation;
      if(conversation.type === "direct"){
        return conversation;
      }
      if(conversation.owner._id !== user._id) throw new ForbiddenException("You don't have permission to update")
      const updatedConversation = {
        ...conversation,
        ...updateConversationDto
      }
      const newConversation = this.conversation.save(updateConversationDto);
      return newConversation;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async outConversation(userId: string, conversationId: string) {
    try{
      const member = await this.memberService.getOne({_id: userId}, {_id: conversationId});
      if(!member) throw new NotFoundException("Not found conversation");
      if(member.conversation.type === "direct") throw new BadRequestException("Cannot out from direct message")
      await this.memberService.deleteMember(member);
      return{
        message: "Out conversation successfull!"
      }
    }catch(error){
      throw new InternalServerErrorException(error.message);
    }
  }
  async deleteConversation(userId: string, conversationId: string) {
    try{
      const member = await this.memberService.getOne({_id: userId}, {_id: conversationId});
    if(!member) throw new NotFoundException("Not found conversation");
    await this.memberService.temporaryDelete(member);
    return {
      message: "out conversation successfull"
    }
    }catch(error){
      throw new InternalServerErrorException(error.message);
    }
  }
  async getEmoji(slug: string, userId: string) {
    try {
      const conversation = await this.conversation.findOne({
        where: { _id: slug },
        relations: {
          emoji: {
            user: true,
          },
        },
      });
      if (!conversation) {
        return {
          status: 404,
          message: 'conversation not found',
          data: null,
        };
      }
      const emoji = conversation.emoji.filter((e) => (e.user as User)._id === userId);
      const emo = {
        ...emoji[0],
      };
      emo.user._id = (emoji[0].user as User)._id;
      return {
        status: 200,
        message: 'get emoji success',
        data: emo,
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
        data: null,
      };
    }
  }
  async updateEmoji(slug: string, userId: string, emoji: Emoji) {
    console.log(emoji);
    try {
      const foundEmoji = await this.emojiRepository.findOne({
        where: {
          _id: emoji._id,
        },
        relations: {
          user: true,
          conversation: true,
        },
      });
      if (!foundEmoji) {
        return {
          status: 404,
          message: 'emoji not found',
          data: null,
        };
      }
      if ((foundEmoji.user as User)._id !== userId || (foundEmoji.conversation as Conversation)._id !== slug) {
        return {
          status: 403,
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
      return {
        status: 200,
        message: 'update emoji success',
        // data: emoji1
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
        data: null,
      };
    }
  }
}
  
