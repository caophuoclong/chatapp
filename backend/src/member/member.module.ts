import { Module, forwardRef } from '@nestjs/common';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '~/database/entities/member.entity';
import { MemberResolver } from '~/graphQL/resolver/member';
import { UserModule } from '~/user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
      
        forwardRef(()=>AuthModule),

        forwardRef(()=>UserModule),
        TypeOrmModule.forFeature([Member])
    ],
  providers: [MemberResolver,MemberService],
  exports: [MemberService]
})
export class MemberModule {}
