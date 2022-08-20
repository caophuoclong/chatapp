import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {

    return this.userService.register(createUserDto);
  }
  @Post("login")
  login(@Body() loginUserDto: LoginUserDto){
    return this.userService.login(loginUserDto);
  }
  @Patch("update-password")
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Param() params ) {
    return this.userService.updatePassword(updatePasswordDto, params._id);
  }
  @Patch("update/:id")
  updateInfo(){

  }

  
}
