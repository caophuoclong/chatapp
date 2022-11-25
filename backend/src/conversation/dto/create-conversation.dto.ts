import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";
import { User } from "~/user/entities/user.entity";

export class CreateConversationDto {
    @ApiProperty({
        description: "The name of conversation"
    })
    @IsNotEmpty()
    name: string;
    @Optional()
    type: string = "group";
    @ApiProperty({
        type: Boolean,
        default: false,
        description: "The visibility of conversation"
    })
    @Optional()
    visible: boolean = false;
    @ApiProperty({
        type: Array<String>,
        description: "The participants id of conversation"
    })
    @IsNotEmpty()
    participants: string;
    @Optional()
    owner: string;
    @ApiProperty({
        type: String,
        description: "The avatar of conversation"
    })
    @Optional()
    avatarUrl: string;
}
