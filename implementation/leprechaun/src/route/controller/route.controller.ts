import { RequiredPermissions } from '@app/internal/service/auth.guard';
import { LineDto } from '@app/line/controller/line.dto';
import { ApiInvalidSchema } from '@app/shared/api/api-invalid-schema.decorator';
import { ApiPaginatedResponse } from '@app/shared/api/generic-paginated';
import { PaginatedDto } from '@app/shared/api/generic-paginated.dto';
import { HttpExceptionDto } from '@app/shared/api/http-exceptions';
import { Paginated, Pagination } from '@app/shared/api/pagination.decorator';
import { UUIDPipe, ValidateCreatePipe } from '@app/shared/api/pipes';
import { VehicleDto } from '@app/vehicle/controller/vehicle.dto';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RouteService } from '../service/route.service';
import { CreateRouteDto, UpdateRouteDto } from './route-create.dto';
import { RouteDto } from './route.dto';

@Controller('/ext/v1/routes')
@ApiExtraModels(VehicleDto)
@ApiExtraModels(LineDto)
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get('/')
  @RequiredPermissions('admin', 'passenger')
  @ApiPaginatedResponse(RouteDto)
  async getAllRoutes(
    @Paginated() pagination: Pagination,
    // @Query('filter') TODO: add filter
  ): Promise<PaginatedDto<RouteDto>> {
    const { routes, total } = await this.routeService.getAll(pagination);
    return PaginatedDto.fromEntities(total, pagination, RouteDto.fromEntities(routes));
  }

  @Get('/:id')
  @RequiredPermissions('admin', 'passenger')
  @ApiOkResponse({ type: RouteDto, description: 'Route details' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Route not found' })
  async getRouteById(id: string): Promise<RouteDto> {
    const route = await this.routeService.getRouteById(id, false);
    return RouteDto.fromEntity(route);
  }

  @Post('/')
  @RequiredPermissions('admin')
  @ApiCreatedResponse({ type: RouteDto, description: 'Created route' })
  @ApiInvalidSchema({ description: 'Invalid route data' })
  async createRoute(@Body(ValidateCreatePipe) createRoute: CreateRouteDto): Promise<RouteDto> {
    const route = await this.routeService.createRoute(createRoute);
    return RouteDto.fromEntity(route);
  }

  @Delete('/:id')
  @RequiredPermissions('admin')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Route deleted' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Route not found' })
  async deleteRouteById(@Param('id', UUIDPipe) id: string): Promise<void> {
    await this.routeService.deleteRoute(id);
  }

  @Patch('/:id')
  @RequiredPermissions('admin')
  @ApiOkResponse({ type: RouteDto, description: 'Updated route' })
  @ApiInvalidSchema({ description: 'Invalid route data' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Route not found' })
  async updateRoute(@Param('id', UUIDPipe) id: string, @Body() updateRoute: UpdateRouteDto): Promise<RouteDto> {
    const route = await this.routeService.updateRoute(id, updateRoute);
    return RouteDto.fromEntity(route);
  }
}
