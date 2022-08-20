import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {JwtModule} from "@nestjs/jwt"
@Module({
    imports: [
        JwtModule.register({
            secret: "26032001",
            signOptions: {
                expiresIn: "1d"
            }
        })
    ],
    controllers: [],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
