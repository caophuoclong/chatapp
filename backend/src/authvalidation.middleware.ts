import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthvalidationMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log("123");
    next();
  }
}
