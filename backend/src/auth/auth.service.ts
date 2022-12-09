import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '~/user/dto/create-user.dto';
import ms from "ms";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string){
    const user = await this.userService.login({username, password});
    return {...user};
  }
  async register(user: CreateUserDto){
    return await this.userService.register(user);
  }
  async login(rest: {
    username: string,
    password: string
  }){
    const user = await this.validateUser(rest.username, rest.password);
    const accessToken = await this.generateToken({_id: user._id, username: user.username});
    const refreshToken = await this.generateToken({_id: user._id, username: user.username},true);
    return {
      accessToken,
      refreshToken,
      _id: user._id
    }
  }
  async generateSocketToken(param:{_id: string, username: string}){
    // unlimited time
    const token = this.jwtService.sign({
      _id: param._id,
      username: param.username
    });
    return token;
  }
  async generateToken({_id, username}: {
    _id: string,
    username: string
  }, isRefresh=false){
    let expiredTime: string;
    if(isRefresh) expiredTime = this.configService.get<string>("expiredRefreshToken");
    else expiredTime = this.configService.get<string>("expiredAccessToken");
    const expiresIn = ms(expiredTime) / 1000;
    const token = this.jwtService.sign({
      _id,
      username
    },{
      expiresIn
    })
    return {
      token,
      expired_time: expiresIn + new Date().getTime()
    }
  }
  verifyJWT(bearerToken: string){
    try{
      const response = this.jwtService.verify(bearerToken);
    return response as {
      _id: string,
      username: string;
    };
    }catch(error){
      throw new Error(error);
    }
  }
}
