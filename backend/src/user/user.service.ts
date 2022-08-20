import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {IUtils} from '~/interfaces/IUtils';
import Utils from '~/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FriendshipService } from '~/friendship/friendship.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject("IUtils")
    private readonly utils: IUtils,
    private readonly friendShipService: FriendshipService
  ) {}
  async register(createUserDto: CreateUserDto) {
    try{
      
      const { salt, hashedPassowrd } = await this.utils.hashPassword(createUserDto.password);
      createUserDto.password = hashedPassowrd;
      createUserDto.salt = salt;
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return {
        statusCode: 200,
        message: "User created successfully",
      };
    }catch(error){
      throw new HttpException(error.message, 400);
    }
    
    
  }
  async login(loginUserDto: LoginUserDto){
    try{
      const user = await this.userRepository.findOne({
        where: {
          username: loginUserDto.username
        }
      })
      if(!user){
        throw new HttpException("User not found", 400);
      }
      const verified = await this.utils.verify(loginUserDto.password, user.salt, user.password);
      if(!verified){
        throw new HttpException("Invalid password", 403);
      }
      delete user.salt;
      delete user.password;
      return {
        statusCode: 200,
        message: "Login success",
        data: user
      };
    }catch(error){
      throw new HttpException(error.message, 403);
    }
  }
  async updatePassword(updatePasswordDto: UpdatePasswordDto, _id: string) {
    try{
      console.log(_id);
      const user = await this.userRepository.findOne({
        where: {
          _id: _id
        }
      })
      if(!user){
        throw new HttpException("User not found", 400);
      }
      const verified = await this.utils.verify(updatePasswordDto.oldPassword, user.salt, user.password);
      if(!verified){
        throw new HttpException("Old password does not match", 403);
      }
      const { salt, hashedPassowrd } = await this.utils.hashPassword(updatePasswordDto.newPassword);
      user.password = hashedPassowrd;
      user.salt = salt;
      console.log(user);
      await this.userRepository.save(user);
      return {
        statusCode: 200,
        message: "Password updated successfully",
      };
    }catch(error){
      throw new HttpException(error.message, 403);
    }
  }
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
