import { RequestMethod } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Permissions, RoutePermissions } from '../service/auth.guard';

export class RouteDto {
  @ApiProperty({
    description: 'HTTP method',
    enum: () => Object.values(RequestMethod).filter((v) => typeof v === 'string'),
    example: 'POST',
    // without this filter it would include the numeric values as well
    // [ GET, POST, PUT, DELETE, PATCH, ALL, OPTIONS, HEAD, SEARCH, 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
  })
  readonly method: string;

  @ApiProperty({
    description: 'Path to resource',
    example: '/ext/v1/vehicles',
  })
  readonly path: string;

  @ApiProperty({
    description: 'Roles required to access the endpoint',
    enum: Permissions,
    example: ['admin', 'inspector'],
  })
  readonly roles: RoutePermissions[];

  constructor(method: string, path: string, roles: RoutePermissions[]) {
    this.method = method;
    this.path = path;
    this.roles = roles;
  }
}
