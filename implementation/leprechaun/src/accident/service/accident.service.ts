import { RouteService } from '@app/route/service/route.service';
import { Pagination } from '@app/shared/api/pagination.decorator';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccidentDto, UpdateAccidentDto } from '../controller/accident-create.dto';
import { Accident } from '../database/accident.entity';

@Injectable()
export class AccidentService {
  constructor(
    private readonly em: EntityManager,

    private readonly routeService: RouteService,

    @InjectRepository(Accident)
    private readonly accidentRepository: EntityRepository<Accident>,
  ) {}

  async listAll(pagination: Pagination): Promise<{ accidents: Accident[]; total: number }> {
    const accidents = await this.accidentRepository.findAll({
      limit: pagination.size,
      offset: pagination.page * pagination.size,
      populate: ['route.line', 'route.vehicle'],
    });
    const total = await this.accidentRepository.count();

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

      const accident = new Accident(accidentTime, newAccident.description, route, newAccident.resolved);

      // This can throw DriverException if the time is in the future because of database triggers
      // It's a caller responsibility to make sure the time is in the past
      await this.em.persistAndFlush(accident);

      return accident;
    });
  }

  async updateAccident(accidentId: string, newAccident: UpdateAccidentDto): Promise<Accident> {
    return await this.em.transactional(async () => {
      const accident = await this.getAccidentById(accidentId);

      if (accident.resolved) throw new BadRequestException({ details: 'Cannot update resolved accident' });

      // prettier-ignore
      this.accidentRepository.assign(accident, {
        description: newAccident.description ? newAccident.description : accident.description,
        resolved:    newAccident.resolved    ? newAccident.resolved    : accident.resolved,
      });

      await this.em.persistAndFlush(accident);
      return accident;
    });
  }
}
