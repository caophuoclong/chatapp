import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, MessageStatusType } from './entities/message.entity';
import { In, Not, Repository } from 'typeorm';
import { User } from '~/user/entities/user.entity';
import { Conversation } from '../conversation/entities/conversation.entity';
import { ConversationService } from '../conversation/conversation.service';
import { UserService } from '~/user/user.service';
import { Member } from '~/database/entities/member.entity';
import { SocketService } from '../socket/socket.service';
import { MessageSocket } from './message.socket';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly messageSocket: MessageSocket,
    private readonly conversationService: ConversationService,
  ) {}
  async sendMessage(DTO: CreateMessageDto) {
    const { _id: tempId } = DTO;
    const { message, updateAt } = await this.create(DTO);
    const { destination } = message;
    const participants = await this.conversationService.getUserOfConversation(destination);
    this.messageSocket.sendMessage(message);
    return {
      message,
      tempId,
    };
  }
  async create(createMessageDto: CreateMessageDto) {
    try {
      const message = this.messageRepository.create();
      message.sender = createMessageDto.sender;
      message.content = createMessageDto.content;
      message.type = createMessageDto.type;
      message.scale = createMessageDto.scale;
      const conversation = await this.conversationRepository.findOne({
        where: {
          _id: createMessageDto.destination,
        },
      });
      if (conversation) {
        message.destination = conversation;
        conversation.lastMessage = message;
        conversation.updateAt = Date.now();
        message.createdAt = Date.now();
        const data = await this.messageRepository.save(message);
        await this.conversationRepository.save(conversation);
        const destinationId = message.destination._id;
        delete message.destination;
        return {
          message: {
            ...data,
            destination: destinationId,
          },
          updateAt: conversation.updateAt,
        };
      } else {
        throw new NotFoundException('Could not found conversation');
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Some thing wrong!');
    }
  }
  async findByConversation(conversationId: string, userId: string, skip: number, limit: number) {
    try {
      // const user = await this.UserService.get(userId);
      const conversation = await this.conversationRepository.findOne({
        where: {
          _id: conversationId,
        },
        relations: {
          participants: {
            user: true,
          },
        },
      });
      // console.log(conversation);
      // console.log(conversation.participants.find((m) => true));
      if (!conversation || !conversation.participants.find((user) => user.user._id === userId)) {
        return {
          statusCode: 404,
          message: 'Conversation not found',
          data: null,
        };
      }
      // console.log(conversation);
      const id = conversation._id;
      const dateJoin = (
        await this.memberRepository.findOne({
          where: {
            conversation: {
              _id: id,
            },
            user: {
              _id: userId,
            },
          },
        })
      ).createdAt;
      const messages = await this.messageRepository
        .createQueryBuilder('message')
        .where('message.destination_id = :conversationId and message.createdAt > :dateJoin', {
          conversationId: id,
          dateJoin: dateJoin,
        })
        .innerJoinAndSelect('message.sender', 'sender', 'sender._id = message.sender_id')
        .select(['message', 'sender'])
        .limit(20)
        .orderBy('message.createdAt', 'DESC')
        .offset(skip)
        .getManyAndCount();
      // console.log(messages);
      return {
        statusCode: 200,
        message: 'messages found',
        count: messages[1],
        data: messages[0],
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      };
    }
  }
  async receiveMessage(messageId: string) {
    // console.log(messageId);
    try {
      const message = await this.messageRepository.findOne({
        where: {
          _id: messageId,
        },
        relations: ['destination', 'sender'],
        select: {
          _id: true,
          sender: {
            _id: true,
          },
          destination: {
            _id: true,
          },
        },
      });
      if (!message) {
        return {
          statusCode: 404,
          message: 'Message not found',
          data: null,
        };
      }
      message.status = MessageStatusType.RECEIVED;
      const data = await this.messageRepository.save(message);
      return {
        statusCode: 200,
        message: 'Message read successfully',
        data: data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      };
    }
  }
  async markMessageReceived(message: Message) {
    await this.messageRepository.update({
      _id: message._id
    },{
      status: MessageStatusType.RECEIVED
    })
    const key = `${message.sender._id}_${message.destination._id}`;
    // new object with key is key and data is array of data._id
    const dataToEmit: {
      [key: string]: string[];
    } = {
      [key]: [],
    };
    dataToEmit[key].push(message._id);
    this.messageSocket.markReceivedMessage(dataToEmit);

    return message;
  }
  async markAsReceived(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          _id: userId,
        },
        relations: {
          conversations: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const conversationsId = user.conversations.map((conversation) => conversation.conversationId);
      const messages = await this.messageRepository.find({
        where: {
          destination: In(conversationsId),
          status: MessageStatusType.SENT,
          sender: {
            _id: Not(userId),
          },
        },
        relations: {
          sender: true,
          destination: true,
        },
        select: {
          sender: {
            _id: true,
          },
          destination: {
            _id: true,
          },
        },
      });
      messages.forEach((message) => (message.status = MessageStatusType.RECEIVED));
      const messagesUpdated = await this.messageRepository.save(messages);
      const messagesGroupBySenderAndDestination = messagesUpdated.reduce((acc, message) => {
        const key = `${message.sender._id}_${message.destination._id}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(message._id);
        return acc;
      }, {});
      await this.messageSocket.markReceivedMessage(messagesGroupBySenderAndDestination);
      return {
        data: messagesGroupBySenderAndDestination,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async recallMessage(messageId: string) {
    try {
      const message = await this.messageRepository.findOne({
        where: {
          _id: messageId,
        },
        relations:{
          destination: true,
          sender: true
        },
        select:{
          destination: {
            _id: true
          },
          sender:{
            _id: true
          }
        }
      });
      if (!message) {
       throw new NotFoundException('Message not found');
      }
      message.isRecall = true;
      const data = await this.messageRepository.save(message);
      this.messageSocket.recallMessage(message);
      return message;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
