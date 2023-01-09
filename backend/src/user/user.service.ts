import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  CACHE_MANAGER,
  UnauthorizedException,
  HttpStatus,
  NotFoundException,
  BadGatewayException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, JoinTable, In } from 'typeorm';
import { IUtils } from '~/interfaces/IUtils';
import Utils from '~/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FriendshipService } from '~/friendship/friendship.service';
import { ConversationService } from '../conversation/conversation.service';
import { PasswordResetToken } from '~/database/entities/passResetToken.entity';
import { RedisClientType } from 'redis';
import { IListFriend } from '~/interfaces/IListFriend';
import { MailService } from '~/mail/mail.service';
import { Confirmation } from '~/database/entities/confirmation.entity';
import { Emoji } from '~/database/entities/Emoji';
import { Member } from '~/database/entities/member.entity';
import { FriendShipFlag } from '../mail/constant';
import { MemberService } from '~/member/member.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private readonly passFogotToken: Repository<PasswordResetToken>,
    @Inject('IUtils')
    private readonly utils: IUtils,
    private readonly friendShipService: FriendshipService,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,
    private readonly mailService: MailService,
    @InjectRepository(Confirmation)
    private readonly confirmationRepository: Repository<Confirmation>,
    @InjectRepository(Emoji)
    private readonly emojiRepository: Repository<Emoji>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly memberService: MemberService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const lan = createUserDto.lan;
    delete createUserDto.lan;
    try {
      const { salt, hashedPassowrd } = await this.utils.hashPassword(
        createUserDto.password,
      );
      createUserDto.password = hashedPassowrd;
      createUserDto.salt = salt;
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      const confirmation: Omit<Confirmation, '_id'> = {
        user: user,
        token: this.utils.randomToken(),
      };

      await this.confirmationRepository.save(confirmation);
      this.mailService
        .sendUserConfirmation(user, confirmation.token, lan)
        .then((result) => {
          console.log(result);
        });
      return {
        statusCode: 200,
        message: 'User created successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          username: loginUserDto.username,
        },
        select: {
          _id: true,
          salt: true,
          password: true,
          username: true,
          active: true,
          email: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const verified = await this.utils.verify(
        loginUserDto.password,
        user.salt,
        user.password,
      );
      if (!verified) {
        throw new HttpException(
          'Password does not match',
          HttpStatus.FORBIDDEN,
        );
      }
      const { _id, email, username, active } = user;
      if (!active) {
        throw new HttpException('INACTIVE', HttpStatus.FORBIDDEN);
      }
      return {
        _id,
        username,
        email,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async updatePassword(updatePasswordDto: UpdatePasswordDto, _id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          _id: _id,
        },
        select:{
          _id: true,
          password: true,
          salt: true
        }
      });
      if (!user) {
        throw new NotFoundException("user not found")
      }
      console.log(user);
      const verified = await this.utils.verify(
        updatePasswordDto.oldPassword,
        user.salt,
        user.password,
      );
      if (!verified) {
        throw new ForbiddenException('Old password does not match');
      }
      const { hashedPassowrd } = await this.utils.updatePassword(
        updatePasswordDto.newPassword,
        user.salt
      );
      
      user.password = hashedPassowrd;
      await this.userRepository.save(user);
      return {
        statusCode: 200,
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async getUsers(usersId: Array<string>) {
    try {
      const users = await this.userRepository.find({
        where: {
          _id: In(usersId),
        },
      });
      return users;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }
  async get(_id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { _id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        statusCode: 200,
        message: 'User found',
        data: user,
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async getOne(_id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          _id,
        },
      });
      if (!user) {
        throw new HttpException('User not found', 400);
      }
      delete user.salt;
      delete user.password;
      delete user.active;

      return {
        ...user
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
  async getListFriend(_id: string) {
      const response = await this.friendShipService.getFriends(_id)
      return response;
  }
  async getListConversations(userId: string) {
    try {
      if (!userId) {
        throw new NotFoundException('User not found');
      }
      const members = await this.memberRepository.find({
        where: {
          user: {
            _id: userId,
          },
          isDeleted: false,
        },
        select: {
          conversationId: true,
        }
      });
      
      const conversationsId = members.map((member) => member.conversationId);
      const conversations =
        await this.conversationService.getListConversationsById(
          conversationsId,
        );
      
      return conversations.map((conversation)=>({
          ...conversation,
          participants: conversation.members
        }));
    } catch (error) {
      console.log('hi', error);
      throw new InternalServerErrorException(error.message);
    }
  }
  async updateInfo(updateUserDto: UpdateUserDto, _id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          _id: _id,
        },
      });
      if (!user) {
        throw new HttpException('User not found', 400);
      }
      const { password, salt, ...result } = await this.userRepository.save({
        ...user,
        ...updateUserDto,
      });
      return result;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
  async addFriend(_id: string, friendId: string) {
    if (_id === friendId) {
      throw new HttpException('You can not add yourself as friend', 400);
    }
    return this.friendShipService
      .addFreiend(_id, friendId)
      .then((response) => response)
      .catch((error) => new HttpException(error.message, 400));
  }
  async removeFriend(_id: string, friendShipId: string) {
    return this.friendShipService
      .removeFriend(_id, friendShipId)
      .then((response) => response)
      .catch((error) => new HttpException(error.message, error.code));
  }
  async acceptFriend(_id: string, friendShipId: string) {
    return this.friendShipService
      .acceptFriend(_id, friendShipId)
      .then((response) => response)
      .catch((error) => new HttpException(error, 400));
  }
  async rejectFriend(_id: string, friendShipId: string) {
    return this.friendShipService
      .rejectFriend(_id, friendShipId)
      .then((response) => response)
      .catch((error) => new HttpException(error, 400));
  }
  async getFriendShip(_id: string, otherUserId: string) {
    const response = await this.friendShipService.getFriendShip(_id, otherUserId);
    return response;
  }
  async getUserByUsername(_id: string, username: string) {
    const user = await this.userRepository.findOne({
      where:{
        username
      },
    })
    if(!user) throw new NotFoundException("user not found");
    const isFriend = await this.getFriendShip(_id, user._id);
    if(!isFriend){
      return {
        user
      }
    }
    return {
      user,
      friendShipId: isFriend._id,
      flag: _id === isFriend.userAddress._id ? FriendShipFlag.TARGET : FriendShipFlag.SENDER,
      friendShip: isFriend
    }
  }
  async blockFriend(_id: string, friendShipId: string) {
    return this.friendShipService
      .blockFriend(_id, friendShipId)
      .then((response) => response)
      .catch((error) => new HttpException(error, 400));
  }
  async createForgotToken(email: string, lan: 'en' | 'vn') {
    const user = await this.userRepository.findOneBy({
      email: email,
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const token = this.utils.hashToken();
    // remove row with same user
    await this.passFogotToken.delete({
      user: user,
    });

    const PasswordForgotToken = this.passFogotToken.create({
      token: token,
      user: user,
    });
    await this.passFogotToken.save(PasswordForgotToken);
    const link = `${process.env.CLIENT_HOST}/set-password?token=${token}&lan=${lan}`;
    this.mailService.sendMailRecovery(user, link, lan);
    return {
      token: token,
      url: 'http://localhost:3000/set-password?token=' + token,
    };
  }
  async resetPassword(token: string, newPassword: string) {
    const tokenResult = await this.passFogotToken.findOne({
      where: {
        token: token,
      },
      relations: ['user'],
    });
    if (!tokenResult)
      return {
        statusCode: 400,
        message: 'Could not reset password. Because token is invalid',
      };
    if (tokenResult.token_expire < Date.now()) {
      await this.passFogotToken.remove(tokenResult);
      return {
        statusCode: 400,
        message: 'Could not reset password. Because token was expired',
      };
    }
    console.log(tokenResult);
    const User = tokenResult.user;
    const { salt, hashedPassowrd } = await this.utils.hashPassword(newPassword);
    const user = await this.userRepository.findOneBy({
      _id: User._id,
    });
    user.password = hashedPassowrd;
    user.salt = salt;
    await this.userRepository.save(user);
    const listToken = await this.passFogotToken.find({
      where: {
        user: User,
      },
    });
    await this.passFogotToken.remove(listToken);
    return {
      statusCode: 200,
      message: 'Reset password successfull',
    };
  }
  async updateLastOnline(_id: string, status: 'ONLINE' | 'OFFLINE') {
    const user = await this.userRepository.findOneBy({
      _id: _id,
    });
    if (!user)
      throw new NotFoundException('User not found');
    if (status === 'ONLINE') user.lastOnline = 0;
    else user.lastOnline = Date.now();
    await this.userRepository.save(user);
    return {
      statusCode: 200,
      message: 'Update last online successfull',
    };
  }
  async updateAvatar(_id: string, avatarName: string) {
    const user = await this.userRepository.findOneBy({
      _id: _id,
    });
    if (!user)
      return {
        statusCode: 404,
        message: 'User not found',
      };
    user.avatarUrl = avatarName;
    await this.userRepository.save(user);
    return {
      statusCode: 200,
      message: 'Update avatar successfull',
      fileName: avatarName,
    };
  }
  async verifyAccount(token: string) {
    try {
      const confirmation = await this.confirmationRepository.findOne({
        where: {
          token: token,
        },
        relations: ['user'],
      });
      if (token) {
        const user = await this.userRepository.findOneBy({
          _id: confirmation.user._id,
        });
        user.active = true;
        await this.userRepository.save(user);
        await this.confirmationRepository.remove(confirmation);
        return {
          statusCode: 200,
          message: 'Verify account successfull',
        };
      }
      throw new Error('Token not found');
    } catch (error) {
      return {
        statusCode: 400,
        message: 'Could not verify account. Because token is invalid',
      };
    }
  }

}
