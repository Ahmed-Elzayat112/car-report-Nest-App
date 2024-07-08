import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      req.currentUser = user;
    }

    return handler.handle();
  }
}
