import { MinimalRouteDto } from '@app/route/controller/route.dto';
import { RouteService } from '@app/route/service/route.service';
import { ApiInvalidSchema } from '@app/shared/api/api-invalid-schema.decorator';
import { HttpExceptionDto } from '@app/shared/api/http-exceptions';
import { ValidateCreatePipe } from '@app/shared/api/pipes';
import { SideNumberDto as SideNumberParam } from '@app/vehicle/controller/vehicle.dto';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('/int/v1/vehicles')
export class InternalVehiclesController {
  constructor(private readonly routeService: RouteService) {}

  @Get('/:sideNumber/route')
  @ApiOkResponse({ type: MinimalRouteDto, description: 'Returns the current route of the vehicle' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Vehicle not found' })
  @ApiInvalidSchema({ description: 'Invalid sideNumber parameter' })
  async getCurrentVehicleRoute(
    // Packing the parameter into a DTO to leverage the validation
    @Param(ValidateCreatePipe) { sideNumber }: SideNumberParam,
  ): Promise<MinimalRouteDto> {
    const route = await this.routeService.getRouteByVehicleSideNumber(sideNumber);
    return MinimalRouteDto.fromEntity(route);
  }
}
