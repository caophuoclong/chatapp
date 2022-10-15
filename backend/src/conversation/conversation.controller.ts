import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JWTAuthGuard } from '~/auth/jwt-auth.guard';
import { ConversationService } from './conversation.service';
import { CreateConversationDtoFromFriendshipDto } from './dto/create-conversation-friend';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(JWTAuthGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('/create/group')
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
  createNewConversation(@UploadedFile() file: Express.Multer.File,@Body() createConversationDto: CreateConversationDto, @Request() req) {
    const {_id} = req.user;
    createConversationDto.avatarUrl = req.body.fileName;
    return this.conversationService.create(_id,createConversationDto);
  }

  @Post('/create/direct')
  createConversationFromFriendship(
    @Body()
    createConversationDtoFromFriendshipDto: CreateConversationDtoFromFriendshipDto,
  ) {
    return this.conversationService.createFromFriendship(
      createConversationDtoFromFriendshipDto,
    );
  }
  @Patch("/update/:slug")
  @ApiParam({
    name: 'slug',
    description: 'The _id of conversation',
  })
  updateConversation(@Body() updateConversationDto: UpdateConversationDto, @Param("slug", ParseUUIDPipe) slug , @Request() req){
    const {_id} = req.user;
    return this.conversationService.updateConversation(_id,updateConversationDto,slug);

  }
  @Get()
  @ApiQuery({ name: '_id', description: 'Conversation id' })
  getConversation(@Query('_id', ParseUUIDPipe) _id) {
    return this.conversationService.getConversationById(_id);
  }
  @Patch("/out/:slug")
  @ApiParam({name: "slug", description: "The _id of conversation"})
  outConversation(@Param("slug", ParseUUIDPipe) slug , @Request() req){
    const {_id} = req.user;
    return this.conversationService.outConversation(_id,slug);
  }
  @Delete("/delete/:slug")
  @ApiParam({name: "slug", description: "The _id of conversation"})
  deleteConversation(@Param("slug", ParseUUIDPipe) slug , @Request() req){
    const {_id} = req.user;
    return this.conversationService.deleteConversation(_id,slug);
  }
}
