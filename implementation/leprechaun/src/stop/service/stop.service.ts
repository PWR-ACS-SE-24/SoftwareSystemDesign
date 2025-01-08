import { EntityManager, EntityRepository, QueryFlag } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pagination } from 'src/shared/api/pagination.decorator';
import { StopLineMapping } from '../../line/database/stop-line-mapping.entity';
import { LineService } from '../../line/service/line.service';
import { CreateStopDto, UpdateStopDto } from '../controller/stop-create.dto';
import { Stop } from '../database/stop.entity';

@Injectable()
export class StopService {
  constructor(
    private readonly em: EntityManager,

    @Inject(forwardRef(() => LineService))
    private readonly lineService: LineService,

    @InjectRepository(Stop)
    private readonly stopRepository: EntityRepository<Stop>,

    @InjectRepository(StopLineMapping)
    private readonly stopLineMappingRepository: EntityRepository<StopLineMapping>,
  ) {}

  async listAll(pagination: Pagination): Promise<{ stops: Stop[]; total: number }> {
    const stops = await this.stopRepository.findAll({
      limit: pagination.size,
      offset: pagination.page * pagination.size,
    });
    const total = await this.stopRepository.count();

    return { stops, total };
  }

  async findStopById(stopId: string, filters: boolean = true): Promise<Stop> {
    return await this.stopRepository.findOneOrFail(
      { id: stopId },
      { failHandler: () => new NotFoundException({ details: stopId }), filters: filters },
    );
  }

  async createStop(createStop: CreateStopDto): Promise<Stop> {
    const stop = new Stop(createStop.name, createStop.latitude, createStop.longitude);
    await this.em.persistAndFlush(stop);
    return stop;
  }

  async getOrderedStopsForLine(lineId: string): Promise<Stop[]> {
    return (
      await this.stopLineMappingRepository.findAll({
        where: { line: lineId },
        populate: ['stop'],
        orderBy: { order: 'asc' },
      })
    ).map((mapping) => mapping.stop);
  }

  async deleteStopById(stopId: string): Promise<void> {
    // (as discussed with @tchojnacki)
    // if stop is being used by a line, we should create a new line without the stop

    await this.em.transactional(async () => {
      const updated = await this.stopRepository.nativeUpdate({ id: stopId, isActive: true }, { isActive: false });
      if (!updated) throw new NotFoundException({ details: stopId });

      const linesUsingStop = await this.lineService.getAllLinesForStop(stopId);

      // For each line that uses the stop remove the stop
      for (const line of linesUsingStop) {
        const orderedStops = await this.getOrderedStopsForLine(line.id);
        const newStops = orderedStops.filter((stop) => stop.id !== stopId).map((stop) => stop.id);
        await this.lineService.updateLine({ name: line.name, stops: newStops }, line.id);
      }
    });
  }

  async updateStopById(stopId: string, updateStop: UpdateStopDto): Promise<Stop> {
    // (as discussed with @tchojnacki)
    // if stop is being used by a line, we should create a new line with changed stop

    const stop = await this.findStopById(stopId);
    return await this.em.transactional(async () => {
      await this.stopRepository.nativeUpdate({ id: stopId, isActive: true }, { isActive: false });

      const newStop = await this.createStop({ ...stop, ...updateStop });

      const linesUsingStop = await this.lineService.getAllLinesForStop(stopId);

      // For each line replace the stop
      for (const line of linesUsingStop) {
        const orderedStops = await this.getOrderedStopsForLine(line.id);
        const newStops: string[] = [];
        for (const stop of orderedStops) newStops.push(stop.id === stopId ? newStop.id : stop.id);
        await this.lineService.updateLine({ name: line.name, stops: newStops }, line.id);
      }
      return newStop;
    });
  }

  async raiseIfStopsDontExist(stops: string[]): Promise<void> {
    // If we receive stops we check whether they exist in the database (hopefully inexpensive to check before)
    const stopSet = new Set(stops);

    // SELECT DISTINCT * FROM stops WHERE id IN ({stops})
    const stopsIds = await this.stopRepository.find(
      { id: { $in: stops } },
      { fields: ['id'], flags: [QueryFlag.DISTINCT] },
    );

    // If the number of unique stops differ from the number of stops in the database, we throw an exception
    if (stopsIds.length !== stopSet.size) throw new NotFoundException();
  }
}
