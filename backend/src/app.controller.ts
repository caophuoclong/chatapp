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
import { RedisClientType } from '@redis/client';

@ApiTags('Auth')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private authService: AuthService,
    @Inject("REDIS_CLIENT")
    private readonly redisClient: RedisClientType

  ) {}
  @Post('/auth/login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() loginUserDto: LoginUserDto, @Res({passthrough: true }) res) {
    const {refreshToken, ...data} = await this.authService.login(loginUserDto);
    this.redisClient.set(refreshToken, "A");
    res.cookie('refreshToken', refreshToken, {httpOnly: true});
    res.json({...data});
  }
  @Post('/auth/register')
  register(@Body() createUserDto: CreateUserDto) {
    // console.log(createUserDto);
    // return "123"
    console.log(createUserDto);
    return this.authService.register(createUserDto);
  }
  @Get("/auth/refresh-token")
  async refreshToken(@Req() req) {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return {
      statusCode: 401,
      message: "No refresh token"
    };
    const refrshTokenInDatabase = await this.redisClient.get(refreshToken);
    if(refrshTokenInDatabase === null){
      return {
        statusCode: 404,
        message: "Token not found"
      }
    }
    if(refrshTokenInDatabase === "A"){
      const response = await this.authService.generateToken(this.authService.verifyJWT(refreshToken));
      return response;
    }
    return{
      statusCode: 401,
      message: "User has blocked"
    }
  }
  @Post("/auth/create_forgot_token")
  createForgotToken(@Body() createForgotToken: CreateForgotToken){
    console.log(createForgotToken);
    return this.userService.createForgotToken(createForgotToken.email, createForgotToken.lan);
  }
  @Post("/auth/createNewPassword/:token")
  @ApiParam({
    name: "token",
  })
  createNewPassword(@Param("token") token: string, @Body() resetPassword: ResetPassword){
    return this.userService.resetPassword(token, resetPassword.newPassword);
  }
  @Post("/auth/verifyAccount")
  verifyAccount(@Body() body: {token: string}){
    return this.userService.verifyAccount(body.token);
  }
}
