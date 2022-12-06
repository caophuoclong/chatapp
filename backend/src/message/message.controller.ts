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

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JWTAuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    console.log(createMessageDto);
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
