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
import { Repository, JoinTable, In, FindOptionsSelect } from 'typeorm';
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
  async create(createUserDto: CreateUserDto) {
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
        message: 'User created successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async updatePassword(updatePasswordDto: UpdatePasswordDto, _id: string) {
    try {
      const user = await this.getOne({_id}, {
        username: true,
        password: true,
        salt: true
      })
      if (!user) {
        throw new NotFoundException("user not found")
      }
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
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async getOne({_id, username}: Partial<{
    _id: string,
    username: string
  }>, select?:FindOptionsSelect<User>) {
    try {
      const user = await this.userRepository.findOne({
        where: [
          {_id},
          {username}
        ],
        select: select
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
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
