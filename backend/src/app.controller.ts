import { Body, Controller, Get, Inject, Post, Req, Res, Param, BadRequestException, NotFoundException, ForbiddenException, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LoginUserDto } from './user/dto/login-user.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UserService } from './user/user.service';
import { ResetPassword, CreateForgotToken } from './dto/createToken.dto';
import { RedisClientType } from '@redis/client';
import { Request } from "express";
import { JwtStrategy } from './auth/jwt.strategy';
import { JWTAuthGuard } from './auth/jwt-auth.guard';
@ApiTags('Auth')
@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    @Inject("REDIS_CLIENT")
    private readonly redisClient: RedisClientType
  ) {}
  @Post('/auth/login')
  async login(@Body() loginUserDto: LoginUserDto, @Res({passthrough: true }) res) {
    const {refreshToken, accessToken, _id} = await this.authService.login(loginUserDto);
    this.redisClient.hSet("refreshToken", refreshToken.token, "A");
    this.redisClient.hSet("user_refreshToken", _id, refreshToken.token)
    res.cookie('refreshToken', refreshToken.token, {httpOnly: true});
    res.json(accessToken);
  }
  @Post('/auth/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @Get("/auth/refresh-token")
  async refreshToken(@Req() req: Request) {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) throw new BadRequestException("No refresh token provided")
    const refrshTokenInDatabase = await this.redisClient.hGet("refreshToken", refreshToken);
    if(refrshTokenInDatabase === null){
      throw new NotFoundException("No token found in database");
    }
    if(refrshTokenInDatabase === "A"){
      try{
        const response = await this.authService.generateToken(this.authService.verifyJWT(refreshToken));
        return response;
      }catch(error){
        throw new UnauthorizedException("Token expired")
      }
    }
    throw new ForbiddenException("User had been blocked")
  }
  @Post("/auth/create_forgot_token")
  createForgotToken(@Body() createForgotToken: CreateForgotToken){
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
  @Get("/auth/socket")
  @UseGuards(JWTAuthGuard)
  async getSocketToken(@Req() request: Request){
    return this.authService.generateSocketToken(request.user as {_id: string, username: string});
  }
}
