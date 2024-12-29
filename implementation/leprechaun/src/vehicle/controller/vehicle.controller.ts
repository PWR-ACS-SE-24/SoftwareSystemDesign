import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../shared/api/generic-paginated';
import { PaginatedDto } from '../../shared/api/generic-paginated.dto';
import { ResourceNotFoundException, SchemaMismatchException } from '../../shared/api/http-exceptions';
import { VehicleService } from '../service/vehicle.service';
import { CreateVehicleDto, UpdateVehicleDto } from './vehicle-create.dto';
import { VehicleDto } from './vehicle.dto';

export const UUIDPipe = new ParseUUIDPipe({
  version: '7',
  exceptionFactory: () => new SchemaMismatchException(),
});

@Controller('/ext/v1/vehicles')
@ApiExtraModels(PaginatedDto)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/')
  @ApiPaginatedResponse(VehicleDto)
  async getAllVehicles(
    @Query('page') page_: number = 0,
    @Query('size') size_: number = 0,
    // @Query('filter') TODO: add filter
  ): Promise<PaginatedDto<VehicleDto>> {
    const { size, page } = PaginatedDto.sanitizePagination(size_, page_);
    const { vehicles, total } = await this.vehicleService.listAll(size, page);

    return PaginatedDto.fromEntities(total, size, page, VehicleDto.fromEntities(vehicles));
  }

  @Get('/:id')
  @ApiOkResponse({ type: VehicleDto, description: 'Vehicle details' })
  @ApiNotFoundResponse({ type: ResourceNotFoundException, description: 'Vehicle not found' })
  async getVehicleById(@Param('id', UUIDPipe) id: string): Promise<VehicleDto> {
    const vehicle = await this.vehicleService.findVehicleById(id);

    return VehicleDto.fromEntity(vehicle);
  }

  @Post('/')
  @ApiCreatedResponse({ type: VehicleDto, description: 'Created vehicle' })
  async createVehicle(@Body() createVehicle: CreateVehicleDto): Promise<VehicleDto> {
    const vehicle = await this.vehicleService.createVehicle(createVehicle);

    return VehicleDto.fromEntity(vehicle);
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Vehicle deleted' })
  @ApiNotFoundResponse({ type: ResourceNotFoundException, description: 'Vehicle not found' })
  async deleteVehicleById(@Param('id', UUIDPipe) id: string): Promise<void> {
    await this.vehicleService.deleteVehicleById(id);
  }

  @Patch('/:id')
  @ApiOkResponse({ type: VehicleDto, description: 'Updated vehicle' })
  @ApiNotFoundResponse({ type: ResourceNotFoundException, description: 'Vehicle not found' })
  async updateVehicleById(
    @Param('id', UUIDPipe) id: string,
    @Body() updateVehicle: UpdateVehicleDto,
  ): Promise<VehicleDto> {
    const vehicle = await this.vehicleService.updateVehicleById(id, updateVehicle);

    return VehicleDto.fromEntity(vehicle);
  }
}
