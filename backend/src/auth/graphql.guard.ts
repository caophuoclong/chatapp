import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JWTAuthGuard } from "./jwt-auth.guard";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class GraphqlGuard implements CanActivate{
   constructor(
        private readonly authService: AuthService,
    ) {
    }
    getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
  canActivate(context: ExecutionContext) {
      const ctx  = GqlExecutionContext.create(context);
      const authorization = ctx.getContext().req["headers"]["authorization"];
      if(!authorization) throw new UnauthorizedException("Not have authorization");
      const token = authorization.split(" ")[1];
      const {_id, username} = this.authService.verifyJWT(token);
      ctx.getContext().req.user = {
        _id,
        username
      }
      // console.log(ctx.getContext());
      return true;
  }

}