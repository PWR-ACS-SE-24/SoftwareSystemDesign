import { RouteService } from '@app/route/service/route.service';
import { Pagination } from '@app/shared/api/pagination.decorator';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccidentDto, UpdateAccidentDto } from '../controller/accident-create.dto';
import {
  AccidentFilterOptions,
  filterForLineNameLike,
  filterForTimeAfter,
  filterForTimeBefore,
  filterForVehicleSideNumberLike,
} from '../controller/accident-filter.decorator';
import { Accident } from '../database/accident.entity';

@Injectable()
export class AccidentService {
  constructor(
    private readonly em: EntityManager,

    private readonly routeService: RouteService,

    @InjectRepository(Accident)
    private readonly accidentRepository: EntityRepository<Accident>,
  ) {}

  async listAll(
    pagination: Pagination,
    filter: AccidentFilterOptions,
  ): Promise<{ accidents: Accident[]; total: number }> {
    const queryFilters = {
      ...filterForVehicleSideNumberLike(filter.vehicleSideNumberLike),
      ...filterForLineNameLike(filter.lineNameLike),
      ...filterForTimeAfter(filter.startTime),
      ...filterForTimeBefore(filter.endTime),
    };

    const accidents = await this.accidentRepository.findAll({
      where: queryFilters,
      limit: pagination.size,
      offset: pagination.page * pagination.size,
      populate: ['route.line', 'route.vehicle'],
      orderBy: [{ time: 'ASC' }],
    });
    const total = await this.accidentRepository.count(queryFilters);

    return { accidents, total };
  }

  async getAccidentById(accidentId: string): Promise<Accident> {
    return await this.accidentRepository.findOneOrFail(
      { id: accidentId },
      { failHandler: () => new NotFoundException({ details: accidentId }), populate: ['route.line', 'route.vehicle'] },
    );
  }

  async createAccident(newAccident: CreateAccidentDto): Promise<Accident> {
    return await this.em.transactional(async () => {
      const route = await this.routeService.getRouteById(newAccident.route);
      const accidentTime = new Date(newAccident.time);

      const accident = new Accident(accidentTime, newAccident.description, route);

      // This can throw DriverException if the time is in the future because of database triggers
      // It's a caller responsibility to make sure the time is in the past
      // For any calls from controller it's guaranteed by the ValidateCreatePipe
      await this.em.persistAndFlush(accident);

      return accident;
    });
  }

  async resolveAccident(accidentId: string): Promise<void> {
    await this.em.transactional(async () => {
      const accident = await this.getAccidentById(accidentId);

      if (accident.resolved) throw new BadRequestException({ details: 'Cannot resolve already resolved accident' });

      accident.resolved = true;

      await this.em.persistAndFlush(accident);
    });
  }

  async updateAccident(accidentId: string, newAccident: UpdateAccidentDto): Promise<Accident> {
    return await this.em.transactional(async () => {
      const accident = await this.getAccidentById(accidentId);

      if (accident.resolved) throw new BadRequestException({ details: 'Cannot update resolved accident' });

      this.accidentRepository.assign(accident, {
        description: newAccident.description ?? accident.description,
      });

      await this.em.persistAndFlush(accident);
      return accident;
    });
  }
}
