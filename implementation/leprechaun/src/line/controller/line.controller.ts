import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiExtraModels, ApiNoContentResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../shared/api/generic-paginated';
import { PaginatedDto } from '../../shared/api/generic-paginated.dto';
import { HttpExceptionDto } from '../../shared/api/http-exceptions';
import { UUIDPipe, ValidateCreatePipe, ValidateUpdatePipe } from '../../shared/api/pipes';
import { StopDto } from '../../stop/controller/stop.dto';
import { LineService } from '../service/line.service';
import { CreateLineDto, UpdateLineDto } from './line-create.dto';
import { LineDto } from './line.dto';

@Controller('/ext/v1/lines')
@ApiExtraModels(StopDto)
@ApiExtraModels(PaginatedDto)
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Get('/')
  @ApiPaginatedResponse(LineDto)
  async getAllLines(
    @Query('page') page_: number = 0,
    @Query('size') size_: number = 50,
    // @Query('filter') TODO: add filter
  ): Promise<PaginatedDto<LineDto>> {
    const { size, page } = PaginatedDto.sanitizePagination(size_, page_);
    const { lines, total } = await this.lineService.listAll(size, page);

    return PaginatedDto.fromEntities(total, size, page, LineDto.fromEntities(lines));
  }

  @Get('/:id')
  @ApiCreatedResponse({ type: LineDto, description: 'Line details' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Line not found' })
  async getLineById(@Param('id', UUIDPipe) id: string): Promise<LineDto> {
    const line = await this.lineService.getLineById(id, false);

    return LineDto.fromEntity(line);
  }

  @Post('/')
  @ApiCreatedResponse({ type: LineDto, description: 'Created line' })
  async createLine(@Body(ValidateCreatePipe) createLine: CreateLineDto): Promise<LineDto> {
    const stop = await this.lineService.createLine(createLine);

    return LineDto.fromEntity(stop);
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Line deleted' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Line not found' })
  async deleteLineById(@Param('id', UUIDPipe) id: string): Promise<void> {
    await this.lineService.deleteLineById(id);
  }

  @Patch('/:id')
  @ApiCreatedResponse({ type: LineDto, description: 'Update line' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Line not found' })
  async updateLine(
    @Param('id', UUIDPipe) id: string,
    @Body(ValidateUpdatePipe) updateLine: UpdateLineDto,
  ): Promise<LineDto> {
    const stop = await this.lineService.updateLine(updateLine, id);

    return LineDto.fromEntity(stop);
  }
}
