import { Optional } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateConversationDto } from './create-conversation.dto';

export class UpdateConversationDto {
    @ApiProperty({
        description: "The name of conversation"
    })
    @Optional()
    name: string;
    @ApiProperty({
        type: Boolean,
        default: false,
        description: "The status of conversation which is false if conversation is active"
    })
    @Optional()
    isBlocked: boolean
    @ApiProperty({
        type: Boolean,
        description: "The visibility of conversation"
    })
    @Optional()
    visible: boolean;


}
