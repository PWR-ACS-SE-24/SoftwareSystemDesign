import { getConfiguredTestconfig } from '@app/config/mikro-orm.test.config';
import { LineModule } from '@app/line/line.module';
import { Route, ROUTE_TRIGGER_NAME } from '@app/route/database/route.entity';
import { RouteService } from '@app/route/service/route.service';
import { SharedModule } from '@app/shared/shared.module';
import { createRoute, createTimeOffsetFromNow, FuncOrPromise, withoutTrigger } from '@app/shared/test/helpers';
import { VehicleModule } from '@app/vehicle/vehicle.module';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalVehiclesController } from '../controller/internal-vehicles.controller';

describe('InternalVehiclesController', () => {
  let controller: InternalVehiclesController;
  let em: EntityManager;
  let orm: MikroORM;
  let disableTrigger: (f: FuncOrPromise) => Promise<unknown>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(getConfiguredTestconfig(process.env.JEST_WORKER_ID!)),
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
    await orm.getSchemaGenerator().createSchema();
  });

  beforeEach(async () => {
    await em.begin();
  });

  afterEach(async () => {
    em.clear();
    await em.rollback();
  });
  afterAll(async () => {
    await orm.getSchemaGenerator().dropDatabase();
    await orm.close(true);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /*
   * I dont have a way to check if the trigger is disabled other than checking on a real table,
   * thats why I dont test it in another file or with custom entity. :c
   */
  it('disable trigger should work', async () => {
    // given
    const { route, line, vehicle } = createRoute({
      lineName: '145',
      sideNumber: '2222',
      routeStartTime: { hours: -1 },
      routeEndTime: { hours: +1 },
    });

    // when
    await disableTrigger(em.persistAndFlush([route, line, vehicle]));
    await expect(em.find(Route, { id: route.id }, { filters: false })).resolves.toBeDefined();
  });

  it('should return a route', async () => {
    // given
    const sideNumber = '2222';
    const { route, line, vehicle } = createRoute({
      lineName: '145',
      sideNumber: sideNumber,
      routeStartTime: { hours: -1 },
      routeEndTime: { hours: +1 },
    });
    await disableTrigger(em.persistAndFlush([route, line, vehicle]));

    // when
    const result = await controller.getCurrentVehicleRoute({ sideNumber });

    // then
    expect(result).toBeDefined();
    expect(result.id).toBe(route.id);
  });

  it('should return active route', async () => {
    // given
    const sideNumber = '2222';
    const { route, line, vehicle } = createRoute({
      lineName: '145',
      sideNumber: sideNumber,
      routeStartTime: { hours: -1 },
      routeEndTime: { hours: +1 },
    });
    route.isActive = false;
    const newRoute = new Route(
      createTimeOffsetFromNow({ hours: -1 }),
      createTimeOffsetFromNow({ hours: +2 }),
      line,
      vehicle,
    );

    await disableTrigger(em.persistAndFlush([route, newRoute]));

    // when
    const result = await controller.getCurrentVehicleRoute({ sideNumber });

    // then
    expect(result).toBeDefined();
    expect(result.id).toBe(newRoute.id);
  });

  it('should raise NotFoundException when route is not found', async () => {
    // given
    const sideNumber = '2222';

    // then
    await expect(controller.getCurrentVehicleRoute({ sideNumber })).rejects.toThrow(NotFoundException);
  });

  it('should return propper route', async () => {
    // given
    const { route: route1 } = createRoute({
      lineName: '145',
      sideNumber: '2222',
      routeStartTime: { hours: -1 },
      routeEndTime: { hours: +1 },
    });
    const { route: route2 } = createRoute({
      lineName: '146',
      sideNumber: '3333',
      routeStartTime: { hours: -1 },
      routeEndTime: { hours: +1 },
    });
    const { route: route3 } = createRoute({
      lineName: '134',
      sideNumber: '4444',
      routeStartTime: { hours: -1 },
      routeEndTime: { hours: +1 },
    });
    await disableTrigger(em.persistAndFlush([route1, route2, route3]));

    // when
    const result = await controller.getCurrentVehicleRoute({ sideNumber: '3333' });

    // then
    expect(result).toBeDefined();
    expect(result.id).toBe(route2.id);
  });

  it('should return current route', async () => {
    const sideNumber = '2222';
    const {
      route: route1,
      line,
      vehicle,
    } = createRoute({
      lineName: '145',
      sideNumber,
      routeStartTime: { hours: -3 },
      routeEndTime: { hours: -1 },
    });

    const route2 = new Route(
      createTimeOffsetFromNow({ hours: -1, seconds: 1 }),
      createTimeOffsetFromNow({ hours: +1 }),
      line,
      vehicle,
    );
    const route3 = new Route(
      createTimeOffsetFromNow({ hours: +1, seconds: 1 }),
      createTimeOffsetFromNow({ hours: +3 }),
      line,
      vehicle,
    );

    await disableTrigger(em.persistAndFlush([route1, route2, route3]));

    // when
    const result = await controller.getCurrentVehicleRoute({ sideNumber: '2222' });

    // then
    expect(result).toBeDefined();
    expect(result.id).toBe(route2.id);
  });
});
