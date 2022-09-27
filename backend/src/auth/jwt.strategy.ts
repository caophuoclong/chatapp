import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { config } from '~/configs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config().jwtSecret,
    });
  }

  async validate(payload: any) {
    try{
      return { _id: payload._id, username: payload.username };
      
    }catch(error){
      console.log(1231231)
    }
    
  }
}