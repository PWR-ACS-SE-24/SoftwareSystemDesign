import { RequiredPermissions } from '@app/internal/service/auth.guard';
import { RouteDto } from '@app/route/controller/route.dto';
import { ApiPaginatedResponse } from '@app/shared/api/generic-paginated';
import { PaginatedDto } from '@app/shared/api/generic-paginated.dto';
import { HttpExceptionDto } from '@app/shared/api/http-exceptions';
import { Paginated, Pagination } from '@app/shared/api/pagination.decorator';
import { UUIDPipe, ValidateCreatePipe } from '@app/shared/api/pipes';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { AccidentService } from '../service/accident.service';
import { CreateAccidentDto, UpdateAccidentDto } from './accident-create.dto';
import { AccidentFilter, AccidentFilterOptions } from './accident-filter.decorator';
import { AccidentDto } from './accident.dto';

@Controller('/ext/v1/accidents')
@ApiExtraModels(RouteDto)
@ApiExtraModels(PaginatedDto)
export class AccidentController {
  constructor(private readonly accidentService: AccidentService) {}

  @Get('/')
  @RequiredPermissions('admin', 'passenger', 'driver', 'inspector')
  @ApiPaginatedResponse(AccidentDto)
  async getAllAccidents(
    @Paginated() pagination: Pagination,
    @AccidentFilter() filter: AccidentFilterOptions = {},
  ): Promise<PaginatedDto<AccidentDto>> {
    const { accidents, total } = await this.accidentService.listAll(pagination, filter);
    return PaginatedDto.fromEntities(total, pagination, AccidentDto.fromEntities(accidents));
  }

  @Get('/:id')
  @RequiredPermissions('admin', 'passenger', 'driver', 'inspector')
  @ApiOkResponse({ type: AccidentDto, description: 'Accident details' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Accident not found' })
  async getAccidentById(@Param('id', UUIDPipe) id: string): Promise<AccidentDto> {
    const accident = await this.accidentService.getAccidentById(id);
    return AccidentDto.fromEntity(accident);
  }

  @Post('/')
  @RequiredPermissions('driver', 'inspector')
  @ApiOkResponse({ type: AccidentDto, description: 'Created accident' })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: HttpExceptionDto,
    description: 'Invalid accident create data',
  })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Route not found' })
  async createAccident(@Body(ValidateCreatePipe) createAccident: CreateAccidentDto): Promise<AccidentDto> {
    const accident = await this.accidentService.createAccident(createAccident);
    return AccidentDto.fromEntity(accident);
  }

  @Post('/:id/resolve')
  @RequiredPermissions('driver', 'inspector')
  @ApiNoContentResponse({ type: AccidentDto, description: 'Resolved accident' })
  @ApiBadRequestResponse({ type: HttpExceptionDto, description: 'Cannot resolve already resolved accident' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Accident not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async resolveAccident(@Param('id', UUIDPipe) id: string): Promise<void> {
    await this.accidentService.resolveAccident(id);
  }

  @Patch('/:id')
  @RequiredPermissions('driver', 'inspector')
  @ApiOkResponse({ type: AccidentDto, description: 'Updated accident' })
  @ApiNotFoundResponse({ type: HttpExceptionDto, description: 'Accident not found' })
  @ApiBadRequestResponse({ type: HttpExceptionDto, description: 'Cannot update resolved accident' })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: HttpExceptionDto,
    description: 'Invalid accident update data',
  })
  async updateAccident(
    @Param('id', UUIDPipe) id: string,
    @Body() updateAccident: UpdateAccidentDto,
  ): Promise<AccidentDto> {
    const accident = await this.accidentService.updateAccident(id, updateAccident);
    return AccidentDto.fromEntity(accident);
  }
}
