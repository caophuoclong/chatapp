import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {JwtModule} from "@nestjs/jwt"
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
@Module({
    imports: [
        UserModule,
        PassportModule
    ],
    controllers: [],
    providers: [AuthService, LocalStrategy],
    exports: [AuthService]
})
export class AuthModule {}
