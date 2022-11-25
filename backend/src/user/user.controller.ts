import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Inject,
  Query,
  ParseUUIDPipe,
  Req,
  UseInterceptors,
  UploadedFile,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JWTAuthGuard } from '../auth/jwt-auth.guard';
import Utils from '~/utils';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CatchHttpException } from '~/exceptions/HttpException';
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JWTAuthGuard)
@Controller('user')
@UseFilters(new CatchHttpException())
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('IUtils')
    private readonly utils: Utils,
  ) {}
  @ApiResponse({ status: 201, description: 'Create user successfully'})
  @Get()
  getMe(@Req() req) {

    const _id = req.user._id;
    return this.userService.getMe(_id);
  }
  @Get("friends")
  getListFriend(@Request() req) {
    const _id = req.user._id;
    return this.userService.getListFriend(_id);
  }
  @Get("conversations")
  getConversations(@Request() req) {
    const _id = req.user._id;
    return this.userService.getListConversations(_id);
  }
  @Get('/:_id')
  getOther(@Param('_id') id) {
    const _id = id;
    return this.userService.get(_id);
  }
  @Patch('update-password')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Request() req) {
    const _id = req.user._id;
    return this.userService.updatePassword(updatePasswordDto, _id);
  }
  @Patch('update-info')
  updateInfo(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateInfo(
      this.utils.removeEmpyObject<UpdateUserDto>(updateUserDto),
      req.user._id,
    );
  }
  @Post("/friends/add/")
  @ApiQuery({ name: '_id', description: 'User id' })
  addFriend(@Request() req, @Query("_id") _id){

    return this.userService.addFriend(req.user._id, _id)
  }
  @Post("/friends/remove/")
  @ApiQuery({ name: '_id', description: 'friendship id' })

  removeFriend(@Request() req,  @Query( "_id", ParseUUIDPipe) _id){
    return this.userService.removeFriend(req.user._id, _id)
  }
  @Post("/friends/accept/")
  @ApiQuery({ name: '_id', description: 'friendship id' })
  acceptFriend(@Request() req, @Query( "_id", ParseUUIDPipe) _id){
    return this.userService.acceptFriend(req.user._id, _id)
  }
  @Post("/friends/reject/")
  @ApiQuery({ name: '_id', description: 'friendship id' })
  rejectFriend(@Request() req, @Query( "_id", ParseUUIDPipe) _id){
    return this.userService.rejectFriend(req.user._id, _id)
  }
  @Get("/friend/username/")
  @ApiQuery({ name: 'username', description: 'Username' })
  getUserByUsername(@Request() req, @Query("username") username){
    const _id = req.user._id;
   return this.userService.getUserByUsername(_id, username)
  }
  @Get("/friend/")
  @ApiQuery({ name: 'userId', description: 'User id' })
  getFriendShip(@Request() req, @Query("userId") userId){
    return this.userService.getFriendShip(req.user._id, userId)
  }
  @Post("/update-avatar")
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: "./images",
      filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName)
        req.body.fileName = fileName;
      }
    })
  }))
  updateAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.userService.updateAvatar(req.user._id, req.body.fileName);
  }

  }
 

