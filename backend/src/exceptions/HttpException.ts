import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class CatchHttpException implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        // console.log("test", exception);
        switch(status){
            case 401:
                return response.status(401).json({
                    path: request.url,
                    message: "Token is invalid, please refresh token"
                })
                break;
            default:
                return response.status(status).json({
                    path: request.url,
                    message: exception.message
                })
        }        
    }
}