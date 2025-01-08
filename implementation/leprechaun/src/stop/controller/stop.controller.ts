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
import { StopService } from '../service/stop.service';
import { CreateStopDto, UpdateStopDto } from './stop-create.dto';
import { StopDto } from './stop.dto';

@Controller('/ext/v1/stops')
@UseGuards(AuthGuard)
@ApiExtraModels(PaginatedDto)
export class StopController {
  constructor(private readonly stopService: StopService) {}

  @Get('/')
  @Roles('admin', 'passenger')
  @ApiPaginatedResponse(StopDto)
  async getAllStops(
    @Paginated() pagination: Pagination,
    // @Query('filter') TODO: add filter
  ): Promise<PaginatedDto<StopDto>> {
    const { stops, total } = await this.stopService.listAll(pagination);
    return PaginatedDto.fromEntities(total, pagination, StopDto.fromEntities(stops));
  }

  @Get('/:id')
  @Roles('admin', 'passenger')
  @ApiOkResponse({ type: StopDto, description: 'Stop details' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Stop not found' })
  async getStopById(@Param('id', UUIDPipe) id: string): Promise<StopDto> {
    const vehicle = await this.stopService.findStopById(id, false);
    return StopDto.fromEntity(vehicle);
  }

  @Post('/')
  @Roles('admin')
  @ApiCreatedResponse({ type: StopDto, description: 'Created stop' })
  async createStop(@Body(ValidateCreatePipe) createStop: CreateStopDto): Promise<StopDto> {
    const stop = await this.stopService.createStop(createStop);
    return StopDto.fromEntity(stop);
  }

  @Delete('/:id')
  @Roles('admin')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Stop deleted' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Stop not found' })
  async deleteStopById(@Param('id', UUIDPipe) id: string): Promise<void> {
    await this.stopService.deleteStopById(id);
  }

  @Patch('/:id')
  @Roles('admin')
  @ApiOkResponse({ type: StopDto, description: 'Updated stop' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'stop not found' })
  async updateStopById(
    @Param('id', UUIDPipe) id: string,
    @Body(ValidateUpdatePipe) updatestop: UpdateStopDto,
  ): Promise<StopDto> {
    const stop = await this.stopService.updateStopById(id, updatestop);
    return StopDto.fromEntity(stop);
  }
}
