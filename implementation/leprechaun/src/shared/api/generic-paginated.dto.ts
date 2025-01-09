import { Pagination } from '@app/shared/api/pagination.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<TDto> {
  readonly data: TDto[];

  @ApiProperty({ description: 'Total number of items', example: 420, minimum: 0 })
  readonly total: number;
  @ApiProperty({ description: 'Number of items per page', example: 30, minimum: 1, maximum: 100, default: 10 })
  readonly size: number;
  @ApiProperty({ description: 'Current page number', example: 12, minimum: 0, default: 0 })
  readonly page: number;

  constructor(total: number, pagination: Pagination, data: TDto[]) {
    this.total = total;
    this.size = pagination.size;
    this.page = pagination.page;
    this.data = data;
  }

  static fromEntities<TDto>(total: number, pagination: Pagination, data: TDto[]): PaginatedDto<TDto> {
    return new PaginatedDto<TDto>(total, pagination, data);
  }
}
