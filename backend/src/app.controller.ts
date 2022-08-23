import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { LoginUserDto } from './user/dto/login-user.dto';
import {ApiTags} from "@nestjs/swagger"
import { CreateUserDto } from './user/dto/create-user.dto';

@ApiTags("Auth")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}
  @Post("/auth/login")
  @UseGuards(LocalAuthGuard)
  login(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }
  @Post("/auth/register")
  register(@Body() createUserDto: CreateUserDto){
    // console.log(createUserDto);
    // return "123"
    return this.authService.register(createUserDto);
  }
}
