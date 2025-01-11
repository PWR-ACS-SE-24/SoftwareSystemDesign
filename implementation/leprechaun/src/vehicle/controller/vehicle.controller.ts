import { RequiredPermissions } from '@app/internal/service/auth.guard';
import { ApiPaginatedResponse } from '@app/shared/api/generic-paginated';
import { PaginatedDto } from '@app/shared/api/generic-paginated.dto';
import { HttpExceptionDto } from '@app/shared/api/http-exceptions';
import { Paginated, Pagination } from '@app/shared/api/pagination.decorator';
import { UUIDPipe, ValidateCreatePipe, ValidateUpdatePipe } from '@app/shared/api/pipes';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { VehicleService } from '../service/vehicle.service';
import { CreateVehicleDto, UpdateVehicleDto } from './vehicle-create.dto';
import { VehicleDto } from './vehicle.dto';

@Controller('/ext/v1/vehicles')
@ApiExtraModels(PaginatedDto)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/')
  @RequiredPermissions('admin')
  @ApiPaginatedResponse(VehicleDto)
  async getAllVehicles(
    @Paginated() pagination: Pagination,
    // TODO: add filter
  ): Promise<PaginatedDto<VehicleDto>> {
    const { vehicles, total } = await this.vehicleService.listAll(pagination);
    return PaginatedDto.fromEntities(total, pagination, VehicleDto.fromEntities(vehicles));
  }

  @Get('/:id')
  @RequiredPermissions('admin')
  @ApiOkResponse({ type: VehicleDto, description: 'Vehicle details' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Vehicle not found' })
  async getVehicleById(@Param('id', UUIDPipe) id: string): Promise<VehicleDto> {
    const vehicle = await this.vehicleService.getVehicleById(id, false);
    return VehicleDto.fromEntity(vehicle);
  }

  @Post('/')
  @RequiredPermissions('admin')
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, type: HttpExceptionDto, description: 'Invalid vehicle data' })
  @ApiCreatedResponse({ type: VehicleDto, description: 'Created vehicle' })
  async createVehicle(@Body(ValidateCreatePipe) createVehicle: CreateVehicleDto): Promise<VehicleDto> {
    const vehicle = await this.vehicleService.createVehicle(createVehicle);
    return VehicleDto.fromEntity(vehicle);
  }

  @Delete('/:id')
  @RequiredPermissions('admin')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Vehicle deleted' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Vehicle not found' })
  async deleteVehicleById(@Param('id', UUIDPipe) id: string): Promise<void> {
    await this.vehicleService.deleteVehicleById(id);
  }

  @Patch('/:id')
  @RequiredPermissions('admin')
  @ApiOkResponse({ type: VehicleDto, description: 'Updated vehicle' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, type: HttpExceptionDto, description: 'Invalid vehicle data' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Vehicle not found' })
  async updateVehicleById(
    @Param('id', UUIDPipe) id: string,
    @Body(ValidateUpdatePipe) updateVehicle: UpdateVehicleDto,
  ): Promise<VehicleDto> {
    const vehicle = await this.vehicleService.updateVehicleById(id, updateVehicle);
    return VehicleDto.fromEntity(vehicle);
  }
}
