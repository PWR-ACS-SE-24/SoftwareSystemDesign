import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pagination } from 'src/shared/api/pagination.decorator';
import { v7 } from 'uuid';
import { StopService } from '../../stop/service/stop.service';
import { CreateLineDto, UpdateLineDto } from '../controller/line-create.dto';
import { Line } from '../database/line.entity';
import { StopLineMapping } from '../database/stop-line-mapping.entity';

@Injectable()
export class LineService {
  constructor(
    private readonly em: EntityManager,

    @Inject(forwardRef(() => StopService))
    private readonly stopService: StopService,

    @InjectRepository(Line)
    private readonly lineRepository: EntityRepository<Line>,

    @InjectRepository(StopLineMapping)
    private readonly stopLineMappingRepository: EntityRepository<StopLineMapping>,
  ) {}

  async listAll(pagination: Pagination): Promise<{ lines: Line[]; total: number }> {
    const lines = await this.lineRepository.findAll({
      limit: pagination.size,
      offset: pagination.page * pagination.size,
      populate: ['mappings.line', 'mappings.stop'],
    });
    const total = await this.lineRepository.count();

    return { lines, total };
  }

  async getLineById(lineId: string, filters: boolean = true): Promise<Line> {
    const line = await this.lineRepository.findOneOrFail(
      { id: lineId },
      { failHandler: () => new NotFoundException({ details: lineId }), populate: ['mappings.stop'], filters },
    );
    return line;
  }

  async getAllLinesForStop(stopId: string): Promise<Line[]> {
    return (
      await this.stopLineMappingRepository.findAll({
        where: { stop: stopId },
        populate: ['line'],
      })
    ).map((mapping) => mapping.line);
  }

  async createLine(lineCreateDto: CreateLineDto): Promise<Line> {
    return await this.em.transactional(async () => {
      const line = new Line(lineCreateDto.name);
      this.em.persistAndFlush(line);

      // If lines were defined, check if they exist
      if (lineCreateDto.stops) {
        // Make sure that they exist in db
        await this.stopService.raiseIfStopsDontExist(lineCreateDto.stops);

        // Create mappings
        const lineMappings = lineCreateDto.stops.map((stopId, index) =>
          // This is "unsafe", cos any changes to StopLineMapping schema may break this
          // but prevents us from asking db for the entity we know exists
          this.stopLineMappingRepository.create({ id: v7(), line: line.id, stop: stopId, order: index }),
        );
        line.mappings.add(lineMappings);
      }
      return line;
    });
  }

  async updateLine(lineUpdateDto: UpdateLineDto, lineId: string): Promise<Line> {
    // (as discussed with @tchojnacki)
    // simple, just mark as inactive and create a new one
    const line = await this.getLineById(lineId);
    return await this.em.transactional(async () => {
      await this.lineRepository.nativeUpdate({ id: lineId }, { isActive: false });

      return await this.createLine({
        ...line,
        ...lineUpdateDto,
        stops: lineUpdateDto.stops || line.mappings.map((i) => i.id),
      });
    });
  }

  async deleteLineById(lineId: string): Promise<void> {
    // (as discussed with @tchojnacki)
    // simple, just mark as inactive
    const updated = await this.lineRepository.nativeUpdate({ id: lineId }, { isActive: false });
    if (!updated) throw new NotFoundException({ details: lineId });
  }
}
