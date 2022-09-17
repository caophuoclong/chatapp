import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from '~/user/entities/user.entity';
import { Conversation } from '../conversation/entities/conversation.entity';
import { ConversationService } from '../conversation/conversation.service';
import { UserService } from '~/user/user.service';


@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly ConversationService: ConversationService,
    private readonly UserService: UserService,
  ) {}
  async create(senderId: string, createMessageDto: CreateMessageDto) {
    try {
      const message = this.messageRepository.create();
      message.sender = (await this.UserService.get(senderId)).data;
      message.content = createMessageDto.content;
      message.createdAt = new Date().getTime();
      const conversation = await this.conversationRepository.findOne({
        where:{
          _id: createMessageDto.destination
        }
      });
      if (conversation) {
        message.destination = conversation;
        conversation.lastMessage = message;
        const data = await this.messageRepository.save(message);
        await this.conversationRepository.save(conversation);
        delete data.destination;
        return {
          statusCode: 200,
          message: 'Message created successfully',
          data: data,
        };
      } else {
        return {
          statusCode: 404,
          message: 'Conversation not found',
          data: null,
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
  async findByConversation(
    conversationId: string,
    userId: string,
    skip: number,
    limit: number,
  ) {
    try {
      const user = await this.UserService.get(userId);
      const conversation = await this.conversationRepository.findOne({
        where: {
          _id: conversationId,
          participants: user.data,
        },
      });
      if (!conversation) {
        return {
          statusCode: 404,
          message: 'Conversation not found',
          data: null,
        };
      } 
      // console.log(conversation);
      const id = conversation._id
      const messages = await this.messageRepository
      .createQueryBuilder("message", )
      .where("message.destination_id = :conversationId", { conversationId: id })
      .innerJoinAndSelect("message.sender", "sender", "sender._id = message.sender_id")
      .select(["message", "sender"])
      .limit(20)
      .orderBy("message.createdAt", "DESC")
      .offset(skip)
      .getManyAndCount()
      ;
        
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
