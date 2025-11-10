import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "generated/prisma/client";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return true; // Se não há @Roles definido, permite o acesso
    }
    const { user } = context.switchToHttp().getRequest();
    // user é o payload do JWT, anexado pelo JwtAuthGuard
    // Esperamos que ele tenha um campo 'role'
    return requiredRoles.some((role) => user.role === role);
  }
}
