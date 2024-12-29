import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import * as request from 'supertest';
import { v7 as uuid } from 'uuid';
import { HttpExceptionFilter, InternalExceptionFilter } from '../../shared/api/http-exception.filter';
import { CreateVehicleDto } from '../controller/vehicle-create.dto';
import { VehicleController } from '../controller/vehicle.controller';
import { Vehicle } from '../database/vehicle.entity';
import { VehicleService } from '../service/vehicle.service';

const moduleMocker = new ModuleMocker(global);

const UUID_SAMPLE = '019411be-c6c3-7f67-83c1-c088d4280102';
const VEHICLE: Vehicle = { id: UUID_SAMPLE, sideNumber: '2136', isActive: true };
const VEHICLES: Vehicle[] = [VEHICLE];

describe('VehicleController', () => {
  let controller: VehicleController;
  let app: INestApplication;

  afterEach(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
    })
      .useMocker((token) => {
        if (token === VehicleService) {
          const mocked: {
            [key in keyof VehicleService]: jest.Mock<VehicleService[key], Parameters<VehicleService[key]>>;
          } = {
            listAll: jest.fn().mockResolvedValue({ vehicles: VEHICLES, total: VEHICLES.length }),
            findVehicleById: jest.fn().mockResolvedValue(VEHICLES[0]),
            createVehicle: jest.fn().mockImplementation((newVehicle: CreateVehicleDto) => {
              const vehicle = { id: uuid(), ...newVehicle, isActive: true };
              VEHICLES.push(vehicle);
              return vehicle;
            }),
            deleteVehicleById: jest.fn().mockResolvedValue(undefined),
            updateVehicleById: jest.fn().mockResolvedValue(VEHICLES[0]),
          };
          return mocked;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new InternalExceptionFilter());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    controller = module.get<VehicleController>(VehicleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have pagination', async () => {
    const badPage = -4;
    const badSize = 1000;

    const response = await controller.getAllVehicles(badPage, badSize);
    expect(response.total).toBe(VEHICLES.length);
    expect(response.size).toBe(100);
    expect(response.page).toBe(0);
  });

  it('should be 200 when listing all vehicles', async () => {
    await request(app.getHttpServer()).get('/ext/v1/vehicles').expect(200);
  });

  it('should be 200 when using bad pagination', async () => {
    await request(app.getHttpServer()).get('/ext/v1/vehicles?page=-13&size=999').expect(200).type('application/json');
  });

  it('should get vehicle by id', async () => {
    const response = await controller.getVehicleById(UUID_SAMPLE);
    expect(response.sideNumber).toBe(VEHICLE.sideNumber);
  });

  it('should be 200 when getting vehicle by id', async () => {
    await request(app.getHttpServer()).get(`/ext/v1/vehicles/${UUID_SAMPLE}`).expect(200).type('application/json');
  });

  it('should 422 when id is bad', async () => {
    await request(app.getHttpServer()).get('/ext/v1/vehicles/baduuid').expect(422).type('application/json');
  });

  it('should create vehicle', async () => {
    const response = await controller.createVehicle({ sideNumber: '2139' });
    expect(response.sideNumber).toBe('2139');
  });

  it('should be 201 when creating vehicle', async () => {
    await request(app.getHttpServer())
      .post('/ext/v1/vehicles')
      .send({ sideNumber: '2139' })
      .expect(201)
      .type('application/json');
  });

  it('should delete vehicle', async () => {
    const response = await controller.deleteVehicleById(UUID_SAMPLE);
    expect(response).toBeUndefined();
  });

  it('should be 204 when deleting vehicle', async () => {
    await request(app.getHttpServer()).delete(`/ext/v1/vehicles/${UUID_SAMPLE}`).expect(204);
  });

  it('should 422 when id is bad when deleting', async () => {
    await request(app.getHttpServer()).delete('/ext/v1/vehicles/baduuid').expect(422).type('application/json');
  });

  it('should update vehicle', async () => {
    const response = await controller.updateVehicleById(UUID_SAMPLE, { sideNumber: '2139' });
    expect(response).toBeDefined();
  });

  it('should be 200 when updating vehicle', async () => {
    await request(app.getHttpServer())
      .patch(`/ext/v1/vehicles/${UUID_SAMPLE}`)
      .send({ sideNumber: '2139' })
      .expect(200)
      .type('application/json');
  });

  it('should be 422 when updating vehicle with bad id', async () => {
    await request(app.getHttpServer())
      .patch('/ext/v1/vehicles/baduuid')
      .send({ sideNumber: '2139' })
      .expect(422)
      .type('application/json');
  });
});
