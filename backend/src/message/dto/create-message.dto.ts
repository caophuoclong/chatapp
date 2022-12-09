import { Optional } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { User } from "~/user/entities/user.entity";
import { MessageType } from "../entities/message.entity";

export class CreateMessageDto {
    @ApiProperty({
        description: "Temp _id"
    })
    _id: string;
    @ApiProperty({
        description: "Where message is sent"
    })
    @IsUUID()
    @IsNotEmpty()
    destination: string;
    @ApiProperty({
        description: "The message content"
    })
    @IsNotEmpty()
    content: string;
    @ApiPropertyOptional({
        description: "Message can attach something"
    })
    @Optional()
    attachment: Array<string>;
    @ApiPropertyOptional({
        description: "When reply message"
    })
    @Optional()
    parentMessage: string;
    @Optional()
    updateAt: number;
    @Optional()
    type: MessageType;
    @Optional()
    scale: number;
    sender: User
}
