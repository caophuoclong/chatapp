import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Matches } from "class-validator";

export class CreateForgotToken{
    @ApiProperty()
    email: string
    @ApiProperty()
    @IsOptional()
    lan: "en" | "vn" = "en"
}

export class ResetPassword{
    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z0-9_@.#&^+-]{8,}$/,{
        message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number"
    })
    newPassword: string
}