import { Controller } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { PaginatedDto } from '../../shared/api/generic-paginated.dto';
import { LineService } from '../service/line.service';

@Controller('/ext/v1/stops')
@ApiExtraModels(PaginatedDto)
export class LineController {
  constructor(private readonly lineService: LineService) {}
}
