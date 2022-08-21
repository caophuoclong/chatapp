import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '~/user/dto/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
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
    return {
      access_token: this.jwtService.sign({
        ...x
      })
    };
  }
}
