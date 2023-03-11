import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '~/conversation/entities/conversation.entity';
import { Member } from '~/database/entities/member.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>
    ){}
    async create(user: Partial<User>, conversation: Partial<Conversation>){
        const newMember = this.memberRepository.create();
        newMember.conversation._id =   conversation._id,
        newMember.user._id = user._id;
        const {conversation: co, ...result} = await this.memberRepository.save(newMember);
        return result;
    }
    async getOne(user: Partial<User>, conversation: Partial<Conversation>){
        return this.memberRepository.findOne({
            where:{
                user,
                conversation
            },
            relations:{
                user: true,
                conversation: {
                    owner: true
                }
            }
        })
    }
    async recoverMember(user: Partial<User>, conversation: Partial<Conversation>){
        const member = await this.getOne(user, conversation);
        member.isDeleted = false;
        member.deletedAt = 0;
        member.createdAt = new Date().getTime();
        return this.memberRepository.save(member);
    }
    async unblockMember(user: Partial<User>, conversation: Partial<Conversation>){
        const member = await this.getOne(user, conversation);
        member.isBlocked = false;
        member.createdAt = new Date().getTime();
        await this.memberRepository.save(member);
    }
    async deleteMember(member: Member){
        return this.memberRepository.remove(member);
    }
    async temporaryDelete(member: Member){
        member.isDeleted = true;
        member.deletedAt = new Date().getTime();
        return this.memberRepository.save(member);
    }
    async getMembers(conversationId: string) {
        const members = await this.memberRepository.find({
            where:{
                conversation:{
                    _id: conversationId
                }
            },
            relations: {
                user: true
            }
        })
        return members.map((m)=>{
            const {user, conversation, conversationId, userId,...xxx} = m;
            return user
        });
    }
    async getConversationByMember(userId: string){
        const conversations = await this.memberRepository.find({
            where:{
                user:{
                    _id: userId
                },

            },
            relations: {
                conversation:{
                    lastMessage: true,
                    owner: true
                },
            }
        })
        return await Promise.all(conversations.map(async (c)=>{
            return {
            ...c.conversation,
            members: await this.getMembers(c.conversation._id)
        }
        }));

    }

}
