import { ExecutionContext, CanActivate } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (!req.CurrentUser) {
      return false;
    }

    req.CurrentUser.admin;
  }
}
