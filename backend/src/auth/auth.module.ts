import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService)=>{
                return {
                    secret: configService.get("jwtSecret")
                }
            }
        })
    ],
    controllers: [],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
