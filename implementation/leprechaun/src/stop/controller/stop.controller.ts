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
import { StopService } from '../service/stop.service';
import { CreateStopDto, UpdateStopDto } from './stop-create.dto';
import { StopDto } from './stop.dto';

@Controller('/ext/v1/stops')
@ApiExtraModels(PaginatedDto)
export class StopController {
  constructor(private readonly stopService: StopService) {}

  @Get('/')
  @RequiredPermissions('admin', 'passenger')
  @ApiPaginatedResponse(StopDto)
  async getAllStops(
    @Paginated() pagination: Pagination,
    // @Query('filter') TODO: add filter
  ): Promise<PaginatedDto<StopDto>> {
    const { stops, total } = await this.stopService.listAll(pagination);
    return PaginatedDto.fromEntities(total, pagination, StopDto.fromEntities(stops));
  }

  @Get('/:id')
  @RequiredPermissions('admin', 'passenger')
  @ApiOkResponse({ type: StopDto, description: 'Stop details' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Stop not found' })
  async getStopById(@Param('id', UUIDPipe) id: string): Promise<StopDto> {
    const vehicle = await this.stopService.findStopById(id, false);
    return StopDto.fromEntity(vehicle);
  }

  @Post('/')
  @RequiredPermissions('admin')
  @ApiCreatedResponse({ type: StopDto, description: 'Created stop' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, type: HttpExceptionDto, description: 'Invalid stop data' })
  async createStop(@Body(ValidateCreatePipe) createStop: CreateStopDto): Promise<StopDto> {
    const stop = await this.stopService.createStop(createStop);
    return StopDto.fromEntity(stop);
  }

  @Delete('/:id')
  @RequiredPermissions('admin')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Stop deleted' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Stop not found' })
  async deleteStopById(@Param('id', UUIDPipe) id: string): Promise<void> {
    await this.stopService.deleteStopById(id);
  }

  @Patch('/:id')
  @RequiredPermissions('admin')
  @ApiOkResponse({ type: StopDto, description: 'Updated stop' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, type: HttpExceptionDto, description: 'Invalid stop data' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Stop not found' })
  async updateStopById(
    @Param('id', UUIDPipe) id: string,
    @Body(ValidateUpdatePipe) updateStop: UpdateStopDto,
  ): Promise<StopDto> {
    const stop = await this.stopService.updateStopById(id, updateStop);
    return StopDto.fromEntity(stop);
  }
}
