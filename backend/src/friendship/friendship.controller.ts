import { Controller, Delete, Get, ParseUUIDPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { FriendshipService } from './friendship.service';
import { JWTAuthGuard } from '../auth/jwt-auth.guard';

@Controller('friendship')
@UseGuards(JWTAuthGuard)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}
  @Get("/friends")
  getFriends(@Request() req){
    return this.friendshipService.getFriends(req.user._id);
  }
  @Post('/add')
  @ApiQuery({ name: '_id', description: 'User id' })
  addFriend(@Request() req, @Query('_id') _id) {
    return this.friendshipService.create(req.user._id, _id);
  }
  @Patch('/reject')
  @ApiQuery({ name: '_id', description: 'friendship id' })
  rejectFriend(@Request() req, @Query('_id', ParseUUIDPipe) _id) {
    return this.friendshipService.rejectFriend(req.user._id, _id);
  }
  @Patch('/accept')
  @ApiQuery({ name: '_id', description: 'friendship id' })
  acceptFriend(@Request() req, @Query('_id', ParseUUIDPipe) _id) {
    return this.friendshipService.acceptFriend(req.user._id, _id);
  }
  @Delete('/remove')
  @ApiQuery({ name: '_id', description: 'friendship id' })
  removeFriend(@Request() req, @Query('_id', ParseUUIDPipe) _id) {
    return this.friendshipService.removeFriend(req.user._id, _id);
  }
}
