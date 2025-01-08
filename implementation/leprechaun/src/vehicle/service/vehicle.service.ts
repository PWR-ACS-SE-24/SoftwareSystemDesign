import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Pagination } from 'src/shared/api/pagination.decorator';
import { CreateVehicleDto, UpdateVehicleDto } from '../controller/vehicle-create.dto';
import { Vehicle } from '../database/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: EntityRepository<Vehicle>,

    private readonly em: EntityManager,
  ) {}

  async listAll(pagination: Pagination): Promise<{ vehicles: Vehicle[]; total: number }> {
    const vehicles = await this.vehicleRepository.findAll({
      limit: pagination.size,
      offset: pagination.page * pagination.size,
    });
    const total = await this.vehicleRepository.count();

    return { vehicles, total };
  }

  async findVehicleById(vehicleId: string, filters: boolean = true): Promise<Vehicle> {
    return await this.vehicleRepository.findOneOrFail(
      { id: vehicleId },
      { failHandler: () => new NotFoundException({ details: vehicleId }), filters: filters },
    );
  }

  async createVehicle(createVehicle: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = new Vehicle(createVehicle.sideNumber);
    await this.em.persistAndFlush(vehicle);
    return vehicle;
  }

  async deleteVehicleById(vehicleId: string): Promise<void> {
    // As per the requirements, we don't delete, but rather set isActive to false
    const updated = await this.vehicleRepository.nativeUpdate({ id: vehicleId, isActive: true }, { isActive: false });
    if (!updated) throw new NotFoundException({ details: vehicleId });
  }

  async updateVehicleById(vehicleId: string, updateVehicle: UpdateVehicleDto): Promise<Vehicle> {
    // As per the requirements, we don't update in place, but rather set isActive to false and create a new one
    const vehicle = await this.findVehicleById(vehicleId);
    await this.deleteVehicleById(vehicleId);

    // Create new one in place
    const newVehicle = await this.createVehicle({ ...vehicle, ...updateVehicle });

    return newVehicle;
  }
}
