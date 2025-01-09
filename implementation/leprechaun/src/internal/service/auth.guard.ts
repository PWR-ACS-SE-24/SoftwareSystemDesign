import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  RequestMethod,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { ApiForbiddenResponse, ApiHeader, ApiUnauthorizedResponse } from '@nestjs/swagger';

const USER_ROLE_HEADER = 'jp-user-role';
const ROLES_METADATA = 'roles';

// Could do this as binary enum flags, but this is more readable
export const permissions = ['guest', 'passenger', 'driver', 'admin', 'inspector'] as const;
export type RoutePermission = (typeof permissions)[number];

function isRoutePermissions(role: string): role is RoutePermission {
  return permissions.includes(role as RoutePermission);
}

export const RequiredPermissions = (role: RoutePermission, ...roles: RoutePermission[]) => {
  return applyDecorators(
    SetMetadata(ROLES_METADATA, roles),
    UseGuards(AuthGuard),
    ApiHeader({
      name: USER_ROLE_HEADER,
      description: 'User role header',
      required: true,
      // show required roles instead of all
      enum: [role, ...roles],
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Access forbidden' }),
  );
};

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger: Logger = new Logger(AuthGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const roles: RoutePermission[] = this.reflector.get(ROLES_METADATA, context.getHandler());
    const role: string | undefined = request.headers[USER_ROLE_HEADER];
    if (!role || !isRoutePermissions(role)) {
      // If no role is defined in the request, assume that the user is not authenticated
      this.logger.warn('No role defined in the request or bad header');
      throw new UnauthorizedException();
    }

    if (!roles) {
      // If no roles are defined, assume that no one can access the endpoint
      const methodHandler = context.getHandler();
      const httpMethod = this.reflector.get<number>(METHOD_METADATA, methodHandler);
      const controllerPath = this.reflector.get<string>(PATH_METADATA, context.getClass());
      const methodPath = this.reflector.get<string>(PATH_METADATA, methodHandler);
      this.logger.warn(`No roles defined for ${RequestMethod[httpMethod]} ${controllerPath + methodPath}`);
      return false;
    }

    // If the role is not in the list of roles, throw a ForbiddenException
    if (!roles.includes(role)) {
      return false;
    }

    return true;
  }
}
