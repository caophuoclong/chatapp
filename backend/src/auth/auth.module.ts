import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import Utils from '~/utils';
import { MemberModule } from '../member/member.module';
import { AuthResolver } from '~/graphQL/resolver/auth';

@Module({
    imports: [
        forwardRef(()=>UserModule),
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
    providers: [AuthResolver,AuthService, JwtStrategy,{
      provide: 'IUtils',
      useClass: Utils,
    },],
    exports: [AuthService]
})
export class AuthModule {}
