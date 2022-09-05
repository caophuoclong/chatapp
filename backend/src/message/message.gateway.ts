import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
    ParseUUIDPipe,
    ParseIntPipe,
  } from '@nestjs/common';
  import { MessageService } from './message.service';
  import { CreateMessageDto } from './dto/create-message.dto';
  import { UpdateMessageDto } from './dto/update-message.dto';
  import {
    ApiBearerAuth,
    ApiParam,
    ApiPropertyOptional,
    ApiQuery,
    ApiTags,
  } from '@nestjs/swagger';
  import { JWTAuthGuard } from '~/auth/jwt-auth.guard';
  import { isNotEmpty } from 'class-validator';
  import { PaginateDto } from './dto/paginate.dto';
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'dgram';
    @WebSocketGateway(3001, {
    cors: {
      origin: "*"
    }
  })
  export class MessageGateway {
    constructor(private readonly messageService: MessageService) {}
    handleConnection(client: any){
        const x = client.handshake;
        console.log(x);
    }
    @SubscribeMessage('createMessage')
    create(@MessageBody() createMessageDto: CreateMessageDto, ) {
        // const { _id } = req.user;
        // return this.messageService.create(_id, createMessageDto);
      }
  }
  