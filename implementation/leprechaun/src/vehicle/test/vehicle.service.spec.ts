import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from '../../shared/api/validation.service';
import { CreateVehicleDto } from '../controller/vehicle-create.dto';
import { Vehicle } from '../database/vehicle.entity';
import { VehicleService } from '../service/vehicle.service';

const UUID_SAMPLE = '019411be-c6c3-7f67-83c1-c088d4280102';
const VEHICLE = { id: UUID_SAMPLE, sideNumber: '2136', isActive: true };
const VEHICLES: Vehicle[] = [VEHICLE];

describe('VehicleService', () => {
  let service: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        ValidationService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: {
            findAll: jest.fn().mockResolvedValue(VEHICLES),
            count: jest.fn().mockResolvedValue(VEHICLES.length),
            findOne: jest.fn().mockImplementation(({ id }) => VEHICLES.find((v) => v.id === id)),
            create: jest.fn().mockResolvedValue(VEHICLE),
            nativeUpdate: jest.fn().mockImplementation(({ id }) => (VEHICLES.find((v) => v.id === id) ? 1 : 0)),
          },
        },
        {
          provide: EntityManager,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list all vehicles', async () => {
    await expect(service.listAll(1, 0)).resolves.toEqual({ vehicles: VEHICLES, total: VEHICLES.length });
  });

  it('should find vehicle by id', async () => {
    await expect(service.findVehicleById(UUID_SAMPLE)).resolves.toEqual(VEHICLE);
    await expect(service.findVehicleById('not a uuid D:')).rejects.toThrow(NotFoundException);
  });

  it('should create vehicle', async () => {
    await expect(service.createVehicle(new CreateVehicleDto('2136'))).resolves.toEqual(VEHICLE);
  });

  it('should delete vehicle by id', async () => {
    await expect(service.deleteVehicleById(UUID_SAMPLE)).resolves.toBeUndefined();
    await expect(service.deleteVehicleById('not a uuid D:')).rejects.toThrow(NotFoundException);
  });
});
