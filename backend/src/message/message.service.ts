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
    private readonly ConversationService: ConversationService,
    private readonly UserService: UserService,

  ) {}
  async create(senderId: string, createMessageDto: CreateMessageDto) {
    try {
      const message = this.messageRepository.create();
      message.sender = (await this.UserService.get(senderId)).data;
      message.content = createMessageDto.content;
      const conversation = await this.ConversationService.getConversationById(
        createMessageDto.destination
      )
      if(conversation.data){
        message.destination = conversation.data;
      await this.messageRepository.save(message);
      const messageConversation = await this.ConversationService.getParticipants(conversation.data._id)
      return {
        statusCode: 200,
        message: 'Message created successfully',
        data: messageConversation.data
      }
      }
      else{
        return {
          statusCode: 404,
          message: 'Conversation not found',
          data: null
        }
      }
      
      return 'This action adds a new message';
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
