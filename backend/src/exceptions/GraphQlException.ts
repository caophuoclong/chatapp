import { ArgumentsHost, Catch, UnauthorizedException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
@Catch(UnauthorizedException)
export class GraphQlException implements GqlExceptionFilter{
    async catch(exception: any, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        const response = gqlHost.switchToHttp().getResponse();
        console.log(response);
        return new GraphQLError("Unauthorized");
    }
    
}