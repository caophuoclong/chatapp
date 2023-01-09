import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const UserDecorator = createParamDecorator(
    (data: unknown, ctx: ExecutionContext)=>{
        const gqlCtx = GqlExecutionContext.create(ctx);
        const request = gqlCtx.getContext().req;        
        return request.user;
    }
)