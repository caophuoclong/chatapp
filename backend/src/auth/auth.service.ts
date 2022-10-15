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
  async validateUser(username: string, pass: string){
    const user = await this.userService.login({username, password: pass});
    if(user){
      const {_id, email, username} = user.data;
      return {
        _id,
        email,
        username
      };
    }
    return null;
  }
  async register(user: CreateUserDto){
    return await this.userService.register(user);
  }
  async login(user: any){
    // const payload = { username: user.username, sub: user._id};
    const x = await this.validateUser(user.username, user.password);
    const time = ms(this.configService.get<string>("expireTokenTime"))
    const refreshToken = this.jwtService.sign(x, {
      expiresIn: "365d"
    })
    return {
      refreshToken,
      expiredTime:Date.now() + time,
      access_token: this.jwtService.sign({
        ...x
      })
    };
  }
  async generateToken({_id, username}: {
    _id: string,
    username: string
  }){
    const expiredTime = Date.now() + ms(this.configService.get<string>("expireTokenTime"));
    const accessToken = this.jwtService.sign({
      _id,
      username
    })
    return {
      access_token: accessToken,
      expired_time: expiredTime
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
      console.log(error);
    }
  }
}
