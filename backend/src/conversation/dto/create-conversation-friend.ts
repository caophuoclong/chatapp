import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { User } from "~/user/entities/user.entity";

export class CreateConversationDtoFromFriendshipDto{
    @ApiProperty()
    @IsNotEmpty()
    friendShipId: string;

}