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
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JWTAuthGuard } from '~/auth/jwt-auth.guard';
import { Emoji } from '~/database/entities/Emoji';
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
  @Get("/:slug")
    @ApiParam({
    name: 'slug',
    description: 'The _id of conversation need to get',
  })
  getConversationById(@Param("slug") slug, @Req() req){
    return this.conversationService.getOne(slug)
  }
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
    @Request() req,
  ) {
    return this.conversationService.createFromFriendship(
      createConversationDtoFromFriendshipDto,
      req.user._id
    )

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
  @Patch("/out/:slug")
  @ApiParam({name: "slug", description: "The _id of conversation"})
  outConversation(@Param("slug", ParseUUIDPipe) slug , @Request() req){
    const {_id} = req.user;
    return this.conversationService.outConversation(_id,slug);
  }
  @Get("/:slug/emoji")
  @ApiParam({name: "slug", description: "The _id of conversation"})
  getEmoji(@Param("slug", ParseUUIDPipe) slug, @Request() req){
    const {_id} = req.user;
    return this.conversationService.getEmoji(slug, _id);
  }
  @Patch("/:slug/emoji")
  @ApiParam({name: "slug", description: "The _id of conversation"})
  updateEmoji(@Param("slug", ParseUUIDPipe) slug, @Request() req, @Body() data: {
    emoji: Emoji
  }){
    const {_id} = req.user;
    return this.conversationService.updateEmoji(slug, _id, data.emoji);
  }
  @Delete("/delete/:slug")
  @ApiParam({name: "slug", description: "The _id of conversation"})
  removeConversation(@Param("slug", ParseUUIDPipe) slug, @Request() req){
    const {_id} = req.user;
    return this.conversationService.deleteConversation(slug, _id);
  }
  @Patch("/get-again/:slug")
  @ApiParam({name: "slug", description: "The _id of conversation"})
  getAgainConversation(@Param("slug", ParseUUIDPipe) slug, @Request() req){
    const {_id} = req.user;
    return this.conversationService.getAgainConversation(slug, _id);
  }
}
