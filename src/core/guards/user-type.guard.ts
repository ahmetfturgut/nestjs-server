import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    const userTypes = this.reflector.getAllAndMerge<string[]>('userTypes', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!userTypes || userTypes.length == 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!request.user || !userTypes.includes(request.user.type)) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
