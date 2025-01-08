import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuard, Roles } from '../../internal/service/auth.guard';
import { ApiPaginatedResponse } from '../../shared/api/generic-paginated';
import { PaginatedDto } from '../../shared/api/generic-paginated.dto';
import { HttpExceptionDto } from '../../shared/api/http-exceptions';
import { Paginated, Pagination } from '../../shared/api/pagination.decorator';
import { UUIDPipe, ValidateCreatePipe, ValidateUpdatePipe } from '../../shared/api/pipes';
import { VehicleService } from '../service/vehicle.service';
import { CreateVehicleDto, UpdateVehicleDto } from './vehicle-create.dto';
import { VehicleDto } from './vehicle.dto';

@Controller('/ext/v1/vehicles')
@UseGuards(AuthGuard)
@ApiExtraModels(PaginatedDto)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/')
  @Roles('admin')
  @ApiPaginatedResponse(VehicleDto)
  async getAllVehicles(
    @Paginated() pagination: Pagination,
    // TODO: add filter
  ): Promise<PaginatedDto<VehicleDto>> {
    const { vehicles, total } = await this.vehicleService.listAll(pagination);
    return PaginatedDto.fromEntities(total, pagination, VehicleDto.fromEntities(vehicles));
  }

  @Get('/:id')
  @Roles('admin')
  @ApiOkResponse({ type: VehicleDto, description: 'Vehicle details' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Vehicle not found' })
  async getVehicleById(@Param('id', UUIDPipe) id: string): Promise<VehicleDto> {
    const vehicle = await this.vehicleService.findVehicleById(id, false);
    return VehicleDto.fromEntity(vehicle);
  }

  @Post('/')
  @Roles('admin')
  @ApiCreatedResponse({ type: VehicleDto, description: 'Created vehicle' })
  async createVehicle(@Body(ValidateCreatePipe) createVehicle: CreateVehicleDto): Promise<VehicleDto> {
    const vehicle = await this.vehicleService.createVehicle(createVehicle);
    return VehicleDto.fromEntity(vehicle);
  }

  @Delete('/:id')
  @Roles('admin')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Vehicle deleted' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Vehicle not found' })
  async deleteVehicleById(@Param('id', UUIDPipe) id: string): Promise<void> {
    await this.vehicleService.deleteVehicleById(id);
  }

  @Patch('/:id')
  @Roles('admin')
  @ApiOkResponse({ type: VehicleDto, description: 'Updated vehicle' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Vehicle not found' })
  async updateVehicleById(
    @Param('id', UUIDPipe) id: string,
    @Body(ValidateUpdatePipe) updateVehicle: UpdateVehicleDto,
  ): Promise<VehicleDto> {
    const vehicle = await this.vehicleService.updateVehicleById(id, updateVehicle);
    return VehicleDto.fromEntity(vehicle);
  }
}
