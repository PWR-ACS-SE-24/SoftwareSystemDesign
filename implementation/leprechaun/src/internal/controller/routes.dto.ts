import { RequestMethod } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { permissions, RoutePermission } from '../service/auth.guard';

export class EndpointDto {
  @ApiProperty({
    description: 'HTTP method',
    enum: () => Object.values(RequestMethod).filter((v) => typeof v === 'string'),
    example: 'POST',
    // without this filter it would include the numeric values as well
    // [ GET, POST, PUT, DELETE, PATCH, ALL, OPTIONS, HEAD, SEARCH, 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
  })
  readonly method!: string;

  @ApiProperty({
    description: 'Path to resource',
    example: '/ext/v1/vehicles',
  })
  readonly path!: string;

  @ApiProperty({
    description: 'Roles required to access the endpoint',
    isArray: true,
    enum: permissions,
    required: false,
    example: ['admin', 'inspector'],
  })
  readonly roles!: RoutePermission[];

  // There is no EndpointEntity but to be in line with the other DTOs we will keep it named like this
  public static fromEntity(entity: { method: string; path: string; roles: RoutePermission[] }): EndpointDto {
    return entity;
  }

  public static fromEntities(entities: { method: string; path: string; roles: RoutePermission[] }[]): EndpointDto[] {
    return entities.map(EndpointDto.fromEntity);
  }
}
