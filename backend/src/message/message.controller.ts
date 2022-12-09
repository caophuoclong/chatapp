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
  Req,
  UseInterceptors,
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
import { Message } from './entities/message.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JWTAuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    const { _id } = req.user;
    return this.messageService.sendMessage(createMessageDto);
  }

  @Get('/conversation/:_id')
  @ApiParam({
    name: '_id',
    description: 'Conversation Id',
  })
  @ApiQuery({
    name: 'skip',
    description: 'Number messages wish to skip',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit of messages per page',
    required: false,
  })
  @ApiPropertyOptional()
  findAll(
    @Query() paginateQuery: PaginateDto,
    @Param('_id') conversationId,
    @Request() req,
  ) {
    const _id = req.user._id;
    const { skip, limit } = paginateQuery;
    return this.messageService.findByConversation(conversationId, _id, skip || 0  , limit || 20);
  }
  @Post("/received")
  async received(@Body() body: {message: Message}, @Request() req){
    const { _id } = req.user;
    this.messageService.markMessageReceived(body.message);
    return {};
  }
  @Patch("/recallmessage")
  async recallMessage(@Body() body: {messageId: string}){
    return this.messageService.recallMessage(body.messageId)
  }
  @Post("/file")
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: "./images",
      filename: (req, file, cb) => {
        if(file){
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName)
          req.body.fileName = fileName;
        }
      }
    })
  }))
  async uploadFile(@Body() body: {file: Express.Multer.File, message: string, fileName: string}){
    const {file, message} = body;
    const newMessage =JSON.parse(message)
    return this.messageService.sendMessage({
      ...newMessage,
      content: body.fileName,
      destination: newMessage.destination,
    })
  }
}
