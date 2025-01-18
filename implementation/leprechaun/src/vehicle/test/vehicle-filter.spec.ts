import { testConfig } from '@app/config/mikro-orm.test.config';
import { SharedModule } from '@app/shared/shared.module';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { VehicleFilterOptions } from '../controller/vehicle-filter.decorator';
import { Vehicle } from '../database/vehicle.entity';
import { VehicleService } from '../service/vehicle.service';

describe('VehicleServiceFilterTest', () => {
  let service: VehicleService;
  let em: EntityManager;
  let orm: MikroORM;
  let testCase: (filter: VehicleFilterOptions, expected: Array<number>) => Promise<void>;

  let vehicles: Array<Vehicle>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(testConfig), MikroOrmModule.forFeature([Vehicle]), SharedModule],
      providers: [VehicleService],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    em = module.get<EntityManager>(EntityManager);
    orm = module.get<MikroORM>(MikroORM);
  });

  afterEach(async () => {
    await em.rollback();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  beforeEach(async () => {
    await em.begin();

    vehicles = [
      new Vehicle('1234'),
      new Vehicle('2345'),
      new Vehicle('3456'),
      new Vehicle('4567'),
      new Vehicle('5678'),
    ];

    await em.persistAndFlush(vehicles);

    testCase = async (filter: VehicleFilterOptions, expected: Array<number>) => {
      // when
      const { vehicles: foundVehicles, total } = await service.listAll({ page: 0, size: 10 }, filter);
      const foundVehiclesIds = foundVehicles.map((l) => l.id);

      // then
      expect(foundVehicles).toHaveLength(total);
      expect(foundVehiclesIds).toEqual(expected.map((l) => vehicles[l].id));
    };
  });

  it('filterForVehicleSideNumberLike', async () => await testCase({ vehicleSideNumberLike: '45' }, [1, 2, 3]));
});
