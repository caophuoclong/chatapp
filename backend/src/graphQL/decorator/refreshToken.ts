import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import cookieParser from 'cookie-parser';

export const refreshTokenDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(ctx);
  const req = gqlCtx.getContext().req;
  const cookie = req.headers.cookie;
  const output = {};
  cookie.split(/\s*;\s*/).forEach(function (pair) {
    pair = pair.split(/\s*=\s*/);
    output[pair[0]] = pair.splice(1).join('=');
  });
  const json = JSON.stringify(output, null, 4);
  return json;
});
