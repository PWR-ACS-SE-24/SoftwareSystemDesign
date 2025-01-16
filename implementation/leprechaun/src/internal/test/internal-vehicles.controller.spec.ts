import { testConfig } from '@app/config/mikro-orm.test.config';
import { LineModule } from '@app/line/line.module';
import { Route, ROUTE_TRIGGER_NAME } from '@app/route/database/route.entity';
import { RouteService } from '@app/route/service/route.service';
import { SharedModule } from '@app/shared/shared.module';
import { createRoute, withoutTrigger } from '@app/shared/test/helpers';
import { VehicleModule } from '@app/vehicle/vehicle.module';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalVehiclesController } from '../controller/internal-vehicles.controller';

describe('InternalVehiclesController', () => {
  let controller: InternalVehiclesController;
  let em: EntityManager;
  let orm: MikroORM;
  let disableTrigger: (f: () => Promise<void>) => Promise<void>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({ ...testConfig, debug: ['query'] }),
        MikroOrmModule.forFeature([Route]),
        SharedModule,
        LineModule,
        VehicleModule,
      ],
      controllers: [InternalVehiclesController],
      providers: [RouteService],
    }).compile();

    controller = module.get<InternalVehiclesController>(InternalVehiclesController);
    em = module.get<EntityManager>(EntityManager);
    orm = module.get<MikroORM>(MikroORM);

    disableTrigger = withoutTrigger.bind(null, orm, Route, ROUTE_TRIGGER_NAME);

    await em.begin();
  });

  afterEach(async () => {
    await em.rollback();
    await orm.close(true);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /*
   * I dont have a way to check if the trigger is disabled other than checking on a real table,
   * thats why I dont test it in another file or with custom entity. :c
   */
  it.only('disable trigger should work', async () => {
    // given
    const { route, line, vehicle } = createRoute({
      lineName: '145',
      sideNumber: '2222',
      routeStartTime: { hours: -1 },
      routeEndTime: { hours: +1 },
    });

    // when
    await disableTrigger(async () => await em.persistAndFlush([route, line, vehicle]));
    const createdRoute = await em.find(Route, { id: route.id }, { filters: false });

    // then
    expect(createdRoute).toBeDefined();
  }, 60_000);

  it('should return a route', async () => {
    // given
    const sideNumber = '2222';
    const { route, line, vehicle } = createRoute({
      lineName: '145',
      sideNumber: sideNumber,
      routeStartTime: { hours: -1 },
      routeEndTime: { hours: +1 },
    });
    await disableTrigger(async () => await em.persistAndFlush([route, line, vehicle]));

    // when
    const result = await controller.getCurrentVehicleRoute({ sideNumber });

    // then
    expect(result).toBeDefined();
    expect(result.id).toBe(route.id);
  });
});
