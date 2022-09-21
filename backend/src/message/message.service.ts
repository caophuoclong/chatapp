import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, MessageStatusType } from './entities/message.entity';
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

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
  async receiveMessage(messageId: string) {
    // console.log(messageId);
    try {
      const message = await this.messageRepository.findOne({
        where: {
          _id: messageId,
        },
        relations: ["destination", "sender"],
        select:{
          _id: true,
          sender: {
            _id: true
          },
          destination:{
            _id: true
          }
        }
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
  async markAsReceived(userId: string){
    try{
      const user = await this.userRepository.findOne({
        where:{
          _id: userId,
        },
        relations: ["conversations"]
      })
      if(!user){
        return {
          statusCode: 404,
          message: 'User not found',
          data: null,
        };
      }
      const conversations = user.conversations;
      let x = [];
      for(let i = 0; i < conversations.length; i++){
        const conversation = conversations[i];
        const messages = await this.messageRepository.find({
          where:{
            destination: conversation,
            status: MessageStatusType.SENT
          },
          relations: ["sender", "destination"]
        })
        for(let j = 0; j < messages.length; j++){
          const message = messages[j];
          if(message.sender._id !== userId)
          message.status = MessageStatusType.RECEIVED;
          await this.messageRepository.save(message);
          x.push({
            senderId: message.sender._id,
            conversationId: conversation._id,
            messageId: message._id
          })
        }
        
      }return{
        statusCode: 200,
        message: 'Messages marked as received',
        data: x
      }
    }catch(error){
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
