import { Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '~/user/entities/user.entity';
import { Status } from '../../database/entities/status.entity';
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
@Entity()
export class FriendShip {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  _id: string;
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user._id)
  @JoinTable({ name: 'userRequest' })
  userRequest: User;
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user._id)
  userAddress: User;
  @Field((type) => Status)
  @ManyToOne((type) => Status, (s) => s.code)
  status: Status;
  @Field(type => User)
  user: User
  @Field()
  flag: string;
}
