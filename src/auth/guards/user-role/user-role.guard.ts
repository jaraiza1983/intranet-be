import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from '../../../users/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    const req = context.switchToHttp().getRequest();

    const user = req.user as User;

    if(!user){
      throw new BadRequestException("User not found");
    }

    if(validRoles.length===0) return true;

    for (const  role of user.roles){
      if(validRoles.includes(role)){
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${ user.fullName } has not a valid role [${ validRoles }]`
    )
  }
}
