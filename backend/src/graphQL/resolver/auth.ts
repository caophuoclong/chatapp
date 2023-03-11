import { Resolver, Query, Args } from '@nestjs/graphql';
import RefreshToken from '~/database/entities/refreshToken.enity';
import { refreshTokenDecorator } from '../decorator/refreshToken';
import { AuthService } from '../../auth/auth.service';
@Resolver(() => RefreshToken)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Query(() => RefreshToken, { name: 'refreshtoken' })
  async refreshToken(@Args('refreshToken', { type: () => String }) refreshToken) {
    const output = {};
    refreshToken.split(/\s*;\s*/).forEach(function (pair) {
      pair = pair.split(/\s*=\s*/);
      output[pair[0]] = pair.splice(1).join('=');
    });
    const { _id, username } = this.authService.verifyJWT(output["refreshToken"]);
    return this.authService.generateToken({ _id, username });
  }
}
