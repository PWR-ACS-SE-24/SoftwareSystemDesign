import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../shared/api/generic-paginated';
import { PaginatedDto } from '../../shared/api/generic-paginated.dto';
import { HttpExceptionDto } from '../../shared/api/http-exceptions';
import { UUIDPipe, ValidateCreatePipe, ValidateUpdatePipe } from '../../shared/api/pipes';
import { StopService } from '../service/stop.service';
import { CreateStopDto, UpdateStopDto } from './stop-create.dto';
import { StopDto } from './stop.dto';

@Controller('/ext/v1/stops')
@ApiExtraModels(PaginatedDto)
export class StopController {
  constructor(private readonly stopService: StopService) {}

  @Get('/')
  @ApiPaginatedResponse(StopDto)
  async getAllStops(
    @Query('page') page_: number = 0,
    @Query('size') size_: number = 50,
    // @Query('filter') TODO: add filter
  ): Promise<PaginatedDto<StopDto>> {
    const { size, page } = PaginatedDto.sanitizePagination(size_, page_);
    const { stops, total } = await this.stopService.listAll(size, page);

    return PaginatedDto.fromEntities(total, size, page, StopDto.fromEntities(stops));
  }

  @Get('/:id')
  @ApiOkResponse({ type: StopDto, description: 'Stop details' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Stop not found' })
  async getStopById(@Param('id', UUIDPipe) id: string): Promise<StopDto> {
    const vehicle = await this.stopService.findStopById(id, false);

    return StopDto.fromEntity(vehicle);
  }

  @Post('/')
  @ApiCreatedResponse({ type: StopDto, description: 'Created stop' })
  async createStop(@Body(ValidateCreatePipe) createStop: CreateStopDto): Promise<StopDto> {
    const stop = await this.stopService.createStop(createStop);

    return StopDto.fromEntity(stop);
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Stop deleted' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Stop not found' })
  async deleteStopById(@Param('id', UUIDPipe) id: string): Promise<void> {
    await this.stopService.deleteStopById(id);
  }

  @Patch('/:id')
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
