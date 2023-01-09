import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JWTAuthGuard } from "./jwt-auth.guard";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GraphqlGuard extends JWTAuthGuard{
    getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}