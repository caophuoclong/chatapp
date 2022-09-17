import { Body, Controller, Get, Inject, Post, Req, Res, Response, UseGuards, CACHE_MANAGER, Request, Query, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { LoginUserDto } from './user/dto/login-user.dto';
import { ApiBody, ApiParam, ApiProperty, ApiPropertyOptional, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './user/dto/create-user.dto';
import { Cache } from 'cache-manager';
import { UserService } from './user/user.service';
import { ResetPassword, CreateForgotToken } from './dto/createToken.dto';

@ApiTags('Auth')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private authService: AuthService,

  ) {}
  @Post('/auth/login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() loginUserDto: LoginUserDto, @Res({passthrough: true }) res) {
    const {refreshToken, ...data} = await this.authService.login(loginUserDto);
    res.cookie('refreshToken', refreshToken, {httpOnly: true});
    // const refreshTokenList = await this.cache.get("refreshToken") as Array<string> || [];
    // console.log("🚀 ~ file: app.controller.ts ~ line 25 ~ AppController ~ login ~ refreshTokenList", refreshTokenList)
    // if(refreshTokenList.length === 0) {
    //   const x = [refreshToken];
    //   await this.cache.set("refreshToken", x);
    // }else{
    //   const x1 = new Set(refreshTokenList);
    //   x1.add(refreshToken);
    //   const x123 = await this.cache.set("refreshToken", Array.from(x1));
    //   console.log(x123);
    // }
    res.json({...data});
  }
  @Post('/auth/register')
  register(@Body() createUserDto: CreateUserDto) {
    // console.log(createUserDto);
    // return "123"
    return this.authService.register(createUserDto);
  }
  @Get("/auth/refresh-token")
  async refreshToken(@Req() req) {
    // const refreshTokenList = await this.cache.get("online_user") ;
    // console.log(refreshTokenList);
    // console.log(req.cookies);
    return {
      a: "123123"
    }
  }
  @Post("/auth/create_forgot_token")
  createForgotToken(@Body() createForgotToken: CreateForgotToken){
    return this.userService.createForgotToken(createForgotToken.email);
  }
  @Post("/auth/createNewPassword/:token")
  @ApiParam({
    name: "token",
  })
  createNewPassword(@Param("token") token: string, @Body() resetPassword: ResetPassword){
    return this.userService.resetPassword(token, resetPassword.newPassword);
  }
}
