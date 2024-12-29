import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from '../../shared/api/http-exceptions';
import { ValidationService } from '../../shared/api/validation.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../controller/vehicle-create.dto';
import { Vehicle } from '../database/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: EntityRepository<Vehicle>,
    private readonly validationService: ValidationService,
  ) {}

  async listAll(size: number, page: number): Promise<{ vehicles: Vehicle[]; total: number }> {
    const vehicles = await this.vehicleRepository.findAll({ limit: size, offset: page * size });
    const total = await this.vehicleRepository.count();

    return { vehicles, total };
  }

  async findVehicleById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ id });
    if (!vehicle) throw new ResourceNotFoundException(id);

    return vehicle;
  }

  async createVehicle(createVehicle: CreateVehicleDto): Promise<Vehicle> {
    await this.validationService.validate(createVehicle);
    return this.vehicleRepository.create({ isActive: true, sideNumber: createVehicle.sideNumber });
  }

  async deleteVehicleById(id: string): Promise<void> {
    // As per the requirements, we don't delete, but rather set isActive to false
    const updated = await this.vehicleRepository.nativeUpdate({ id }, { isActive: false });
    if (!updated) throw new ResourceNotFoundException(id);
  }

  async updateVehicleById(id: string, updateVehicle: UpdateVehicleDto): Promise<Vehicle> {
    await this.validationService.validate(updateVehicle, true);

    // As per the requirements, we don't update in place, but rather set isActive to false and create a new one
    const vehicle = await this.findVehicleById(id);
    await this.deleteVehicleById(id);

    // Create new one in place
    const newVehicle = await this.createVehicle({ ...vehicle, ...updateVehicle });

    return newVehicle;
  }
}
