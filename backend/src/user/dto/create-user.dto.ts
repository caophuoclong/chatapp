import {IsNotEmpty, IsEmail, IsDateString, Matches} from "class-validator"
import {ApiProperty} from "@nestjs/swagger"
export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    username: string;
    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z0-9_@.#&^+-]{8,}$/,{
        message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number"
    })
    password: string;
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()
    @IsNotEmpty()
    
    name: string;
    @ApiProperty()
    @IsNotEmpty()
    phone: string;

    avatarUrl: string;
    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,{
        message: "Date must be in format dd/mm/yyyy or dd-mm-yyyy or dd.mm.yyyy"
    })
    birthday: string;

    salt: string;

}
