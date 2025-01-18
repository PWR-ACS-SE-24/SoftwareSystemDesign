import { RequiredPermissions } from '@app/internal/service/auth.guard';
import { ApiInvalidSchema } from '@app/shared/api/api-invalid-schema.decorator';
import { ApiPaginatedResponse } from '@app/shared/api/generic-paginated';
import { PaginatedDto } from '@app/shared/api/generic-paginated.dto';
import { HttpExceptionDto } from '@app/shared/api/http-exceptions';
import { Paginated, Pagination } from '@app/shared/api/pagination.decorator';
import { UUIDPipe, ValidateCreatePipe, ValidateUpdatePipe } from '@app/shared/api/pipes';
import { StopDto } from '@app/stop/controller/stop.dto';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { LineService } from '../service/line.service';
import { CreateLineDto, UpdateLineDto } from './line-create.dto';
import { LineFilter, LineFilterOptions } from './line-filter.decorator';
import { LineDto } from './line.dto';

@Controller('/ext/v1/lines')
@ApiExtraModels(StopDto)
@ApiExtraModels(PaginatedDto)
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Get('/')
  @RequiredPermissions('admin', 'passenger')
  @ApiPaginatedResponse(LineDto)
  async getAllLines(
    @Paginated() pagination: Pagination,
    @LineFilter() filter: LineFilterOptions = {},
  ): Promise<PaginatedDto<LineDto>> {
    const { lines, total } = await this.lineService.listAll(pagination, filter);
    return PaginatedDto.fromEntities(total, pagination, LineDto.fromEntities(lines));
  }

  @Get('/:id')
  @RequiredPermissions('admin', 'passenger')
  @ApiOkResponse({ type: LineDto, description: 'Line details' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Line not found' })
  async getLineById(@Param('id', UUIDPipe) id: string): Promise<LineDto> {
    const line = await this.lineService.getLineById(id, false);
    return LineDto.fromEntity(line);
  }

  @Post('/')
  @RequiredPermissions('admin')
  @ApiCreatedResponse({ type: LineDto, description: 'Created line' })
  @ApiInvalidSchema({ description: 'Invalid line data' })
  async createLine(@Body(ValidateCreatePipe) createLine: CreateLineDto): Promise<LineDto> {
    const line = await this.lineService.createLine(createLine);
    return LineDto.fromEntity(line);
  }

  @Delete('/:id')
  @RequiredPermissions('admin')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Line deleted' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Line not found' })
  async deleteLineById(@Param('id', UUIDPipe) id: string): Promise<void> {
    await this.lineService.deleteLineById(id);
  }

  @Patch('/:id')
  @RequiredPermissions('admin')
  @ApiOkResponse({ type: LineDto, description: 'Update line' })
  @ApiInvalidSchema({ description: 'Invalid line data' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Line not found' })
  async updateLine(
    @Param('id', UUIDPipe) id: string,
    @Body(ValidateUpdatePipe) updateLine: UpdateLineDto,
  ): Promise<LineDto> {
    const line = await this.lineService.updateLine(updateLine, id);
    return LineDto.fromEntity(line);
  }
}
