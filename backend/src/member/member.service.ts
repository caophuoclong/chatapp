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
    async getMembers(conversationId: string) {
        const members = await this.memberRepository.find({
            where:{
                conversation:{
                    _id: conversationId
                }
            },
        })
        
        return members.map((m)=>{
            const {user, conversation, conversationId, ...xxx} = m;
            return {
                ...xxx,
                user: m.userId            }
        });
    }
    async getConversationByMember(userId: string){
        const conversations = await this.memberRepository.find({
            where:{
                user:{
                    _id: userId
                },
            },
            relations: ["conversation"]
        })
        return await Promise.all(conversations.map(async (c)=>{
            return {
            ...c.conversation,
            members: await this.getMembers(c.conversation._id)
        }
        }));

    }

}
