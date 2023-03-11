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
    console.log("hehehe it's haha");
    return this.userService.getOne({_id});
  }
  // @Get("friends")
  // // getListFriend(@Request() req, @Query("user") _id) {
  // //   return _id ? this.userService.getListFriend(_id) : this.userService.getListFriend(req.user._id);
  // // }
  // // @Get("conversations")
  // // async getConversations(@Request() req) {
  // //   const _id = req.user._id;
  // //   const response = await this.userService.getListConversations(_id);
  // //   return response;
  // // }
  @Get('/:_id')
  getOther(@Param('_id') _id) {
    return this.userService.getOne({
      _id
    });
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

  @Get("/username/:username")
  @ApiQuery({ name: 'username', description: 'Username' })
  getUserByUsername(@Param() username){
   return this.userService.getOne({username})
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
 

