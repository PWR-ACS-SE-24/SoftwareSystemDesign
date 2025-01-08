import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  RequestMethod,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';

const USER_ROLE_HEADER = 'jp-user-role';
const ROLES_METADATA = 'roles';

// Could do this as binary enum flags, but this is more readable
export const Permissions = ['guest', 'passenger', 'driver', 'admin', 'inspector'] as const;
export type RoutePermissions = (typeof Permissions)[number];

function isRoutePermissions(role: string): role is RoutePermissions {
  return Permissions.includes(role as RoutePermissions);
}

export const Roles = (...roles: RoutePermissions[]) => SetMetadata(ROLES_METADATA, roles);

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger: Logger = new Logger(AuthGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const roles: RoutePermissions[] = this.reflector.get(ROLES_METADATA, context.getHandler());
    if (!roles) {
      // If no roles are defined, assume that no one can access the endpoint
      const methodHandler = context.getHandler();
      const httpMethod = this.reflector.get<number>(METHOD_METADATA, methodHandler);
      const controllerPath = this.reflector.get<string>(PATH_METADATA, context.getClass());
      const methodPath = this.reflector.get<string>(PATH_METADATA, methodHandler);
      this.logger.warn(`No roles defined for ${RequestMethod[httpMethod]} ${controllerPath + methodPath}`);
      throw new ForbiddenException();
    }
    const role: string | undefined = request.headers[USER_ROLE_HEADER];
    if (!role) {
      // If no role is defined in the request, assume that the user is not authenticated
      this.logger.warn('No role defined in the request');
      throw new UnauthorizedException();
    }

    // If the role is not in the list of roles, throw a ForbiddenException
    if (!isRoutePermissions(role) || !roles.includes(role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
