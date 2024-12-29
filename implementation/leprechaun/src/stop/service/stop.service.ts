import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ValidationService } from '../../shared/api/validation.service';
import { CreateStopDto, UpdateStopDto } from '../controller/stop-create.dto';
import { Stop } from '../database/stop.entity';

@Injectable()
export class StopService {
  constructor(
    @InjectRepository(Stop)
    private readonly stopRepository: EntityRepository<Stop>,
    private readonly validationService: ValidationService,
  ) {}

  async listAll(size: number, page: number): Promise<{ stops: Stop[]; total: number }> {
    const stops = await this.stopRepository.findAll({ limit: size, offset: page * size });
    const total = await this.stopRepository.count();

    return { stops, total };
  }

  async findStopById(id: string): Promise<Stop> {
    const stop = await this.stopRepository.findOne({ id });
    if (!stop) throw new NotFoundException(id);

    return stop;
  }

  async createStop(createStop: CreateStopDto): Promise<Stop> {
    await this.validationService.validate(createStop);
    return this.stopRepository.create(createStop);
  }

  async deleteStopById(id: string): Promise<void> {
    const updated = await this.stopRepository.nativeUpdate({ id }, { isActive: false });
    if (!updated) throw new NotFoundException(id);
  }

  async updateStopById(id: string, updateStop: UpdateStopDto) {
    await this.validationService.validate(updateStop, true);

    // As per the requirements, we don't update in place, but rather set isActive to false and create a new one
    const stop = await this.findStopById(id);
    await this.deleteStopById(id);

    // Create new one in place
    const newStop = await this.createStop({ ...stop, ...updateStop });

    return newStop;
  }
}
