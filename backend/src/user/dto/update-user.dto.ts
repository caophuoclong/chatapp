import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEmpty, IsOptional, Matches } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/user.entity';


export class UpdateUserDto  {
    @ApiProperty({
        description: 'Email',
        required: false,
    })
    @IsOptional()
    @IsEmail()
    email: string;
    @IsOptional()
    @ApiProperty({
        description: 'Name',
        required: false,
        
    })
    name: string;
    @ApiProperty({
        description: 'Number Phone',
        required: false,
    })
    @IsOptional()
    phone: string;
    @ApiProperty({
        description: 'Address to avatar',
        required: false,
    })
    @IsOptional()
    avatarUrl: string;
    @ApiProperty({
        description: 'Birthday',
        required: false,
    })
    @IsOptional()
    @Matches(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,{
        message: "Date must be in format dd/mm/yyyy or dd-mm-yyyy or dd.mm.yyyy"
    })
    birthday: string;
    @ApiProperty({
        description: "Gender",
        required: false
    })
    @IsOptional()
    gender: Gender;

}
