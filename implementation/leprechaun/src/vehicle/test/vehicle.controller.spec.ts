import { testConfig } from '@app/config/mikro-orm.test.config';
import { SharedModule } from '@app/shared/shared.module';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateVehicleDto } from '../controller/vehicle-create.dto';
import { VehicleController } from '../controller/vehicle.controller';
import { Vehicle } from '../database/vehicle.entity';
import { VehicleService } from '../service/vehicle.service';

describe('VehicleController', () => {
  let controller: VehicleController;
  let em: EntityManager;
  let orm: MikroORM;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(testConfig), MikroOrmModule.forFeature([Vehicle]), SharedModule],
      controllers: [VehicleController],
      providers: [VehicleService],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    em = module.get<EntityManager>(EntityManager);
    orm = module.get<MikroORM>(MikroORM);
    await em.begin();
  });

  afterEach(async () => {
    await em.rollback();
    await orm.close(true);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should list all vehicles', async () => {
    // given
    const vehicle1 = new Vehicle('2136');
    em.persist(vehicle1);
    const vehicle2 = new Vehicle('2137');
    em.persist(vehicle2);
    await em.flush();

    // when
    const response = await controller.getAllVehicles({ page: 0, size: 10 });

    // then
    expect(response.total).toBe(2);
    expect(response.data[0].sideNumber).toBe('2136');
    expect(response.data[1].sideNumber).toBe('2137');
  });

  it('should get vehicle by id', async () => {
    // given
    const vehicle1 = new Vehicle('2136');
    em.persist(vehicle1);
    const vehicle2 = new Vehicle('2137');
    em.persist(vehicle2);
    await em.flush();

    // when
    const response = await controller.getVehicleById(vehicle1.id);
    expect(response.sideNumber).toBe(vehicle1.sideNumber);
    expect(response.id).toBe(vehicle1.id);
    expect(response.isActive).toBe(true);
  });

  it('should create vehicle', async () => {
    // given
    const newVehicle = <CreateVehicleDto>{ sideNumber: '2139' };

    // when
    const response = await controller.createVehicle(newVehicle);
    const vehicle = await em.findOne(Vehicle, { id: response.id });

    // then
    expect(response.id).toBeDefined();
    expect(response.sideNumber).toBe('2139');
    expect(response.isActive).toBe(true);
    expect(vehicle).toBeDefined();
    expect(vehicle?.sideNumber).toBe('2139');
  });

  it('should update vehicle isActive instead of deleting', async () => {
    // given
    const newVehicle = new Vehicle('2139');
    await em.persistAndFlush(newVehicle);

    // when
    await controller.deleteVehicleById(newVehicle.id);
    const vehicle = await em.refresh(newVehicle, { filters: false });

    // then
    expect(vehicle).toBeDefined();
    expect(vehicle?.isActive).toBe(false);
  });

  it('should create new vehicle when updating', async () => {
    // given
    const oldVehicle = new Vehicle('2139');
    await em.persistAndFlush(oldVehicle);

    // when
    const updatedVehicle = await controller.updateVehicleById(oldVehicle.id, { sideNumber: '9990' });
    await em.refresh(oldVehicle, { filters: false });

    // then
    expect(oldVehicle.id).not.toBe(updatedVehicle.id);
    expect(updatedVehicle.sideNumber).toBe('9990');
    expect(updatedVehicle.isActive).toBe(true);
    expect(oldVehicle.isActive).toBe(false);
  });
});
