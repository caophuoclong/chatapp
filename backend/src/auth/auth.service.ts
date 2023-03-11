import { ForbiddenException, HttpException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '~/user/dto/create-user.dto';
import ms from "ms";
import { ConfigService } from '@nestjs/config';
import Utils from '../utils/index';
import { IUtils } from '~/interfaces/IUtils';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject('IUtils')
    private readonly utils: IUtils,
  ) {}
  async validateUser(username: string, password: string){
    const user = await this.userService.getOne({username},{
      _id: true,
      username: true,
      email: true,
      password: true,
      salt: true,
      active: true
    });
        if (!user) {
        throw new NotFoundException('User not found');
      }
      const verified = await this.utils.verify(
        password,
        user.salt,
        user.password,
      );
      if (!verified) {
        throw new ForbiddenException(
          'Password does not match',
        );
      }
      const { _id, email, active } = user;
      
      if (!active) {
        throw new ForbiddenException('user is not active');
      }
      return {
        _id,
        username,
        email,
      };
  }
  async register(user: CreateUserDto){
    return await this.userService.create(user);
  }
  async login(rest: {
    username: string,
    password: string
  }){
    const user = await this.validateUser(rest.username, rest.password);
    console.log(user);
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
      userId: _id,
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
      throw new UnauthorizedException("Token expired");
    }
  }
}
