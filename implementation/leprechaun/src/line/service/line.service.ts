import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Line } from '../database/line.entity';

@Injectable()
export class LineService {
  constructor(
    @InjectRepository(Line)
    private readonly lineRepository: EntityRepository<Line>,
  ) {}
}
