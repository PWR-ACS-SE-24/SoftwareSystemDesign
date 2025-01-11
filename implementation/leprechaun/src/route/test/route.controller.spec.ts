import { testConfig } from '@app/config/mikro-orm.test.config';
import { Line } from '@app/line/database/line.entity';
import { StopLineMapping } from '@app/line/database/stop-line-mapping.entity';
import { LineModule } from '@app/line/line.module';
import { SharedModule } from '@app/shared/shared.module';
import { Stop } from '@app/stop/database/stop.entity';
import { Vehicle } from '@app/vehicle/database/vehicle.entity';
import { VehicleModule } from '@app/vehicle/vehicle.module';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RouteController } from '../controller/route.controller';
import { Route } from '../database/route.entity';
import { RouteService } from '../service/route.service';

function createTime(hours: number): Date {
  return new Date(new Date().valueOf() + Math.floor(hours * 3600 * 1000));
}

describe('RouteService', () => {
  let controller: RouteController;
  let em: EntityManager;
  let orm: MikroORM;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(testConfig),
        MikroOrmModule.forFeature([Route]),
        SharedModule,
        LineModule,
        VehicleModule,
      ],
      controllers: [RouteController],
      providers: [RouteService],
    }).compile();

    controller = module.get<RouteController>(RouteController);
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

  it('should list all routes', async () => {
    // given
    const line = new Line('145');
    const vehicle = new Vehicle('2222');
    const stop = new Stop('stop1', 1, 1);
    const stopMapping = new StopLineMapping(line, stop, 1);
    const newRoute = new Route(createTime(1), createTime(2), line, vehicle);
    await em.persistAndFlush([line, vehicle, newRoute, stopMapping]);

    // when
    const routes = await controller.getAllRoutes({ page: 0, size: 10 });

    // then
    expect(routes).toBeDefined();
    expect(routes.data).toHaveLength(1);
    expect(routes.data[0].line.id).toBe(line.id);
    expect(routes.data[0].vehicle.id).toBe(vehicle.id);
    expect(routes.data[0].line.stops).toHaveLength(1);
    expect(routes.data[0].line.stops[0].id).toBe(stop.id);
  });

  it('should get route by id', async () => {
    // given
    const line = new Line('145');
    const vehicle = new Vehicle('2222');
    const newRoute = new Route(createTime(1), createTime(2), line, vehicle);
    await em.persistAndFlush([line, vehicle, newRoute]);

    // when
    const route = await controller.getRouteById(newRoute.id);

    // then
    expect(route).toBeDefined();
    expect(route.id).toBe(newRoute.id);
  });

  it('should create route', async () => {
    // given
    const line = new Line('145');
    const vehicle = new Vehicle('2222');
    await em.persistAndFlush([line, vehicle]);

    // when
    const response = await controller.createRoute({
      line: line.id,
      vehicle: vehicle.id,
      startTime: createTime(1).toISOString(),
      endTime: createTime(2).toISOString(),
    });

    // then
    expect(response).toBeDefined();
    expect(response.line.id).toBe(line.id);
    expect(response.vehicle.id).toBe(vehicle.id);
  });

  it('should not return inactive routes', async () => {
    // given
    const line = new Line('145');
    const vehicle = new Vehicle('2222');
    const newRoute = new Route(createTime(1), createTime(2), line, vehicle);
    newRoute.isActive = false;
    await em.persistAndFlush([line, vehicle, newRoute]);

    // when
    const routes = await controller.getAllRoutes({ page: 0, size: 10 });

    // then
    expect(routes.data).toHaveLength(0);
  });

  it('should update route', async () => {
    // given
    const line = new Line('145');
    const vehicle = new Vehicle('2222');
    const route = new Route(createTime(1), createTime(2), line, vehicle);
    const newLine = new Line('146');
    const newVehicle = new Vehicle('3333');

    await em.persistAndFlush([newLine, line, newVehicle, vehicle, route]);

    // when
    const response = await controller.updateRoute(route.id, {
      line: newLine.id,
      vehicle: newVehicle.id,
      startTime: createTime(1.5).toISOString(),
      endTime: createTime(2.5).toISOString(),
    });

    // then
    expect(response).toBeDefined();
    expect(response.line.id).toBe(newLine.id);
    expect(response.vehicle.id).toBe(newVehicle.id);
  });

  it('should update isActive instead of deleting', async () => {
    // given
    const line = new Line('145');
    const vehicle = new Vehicle('2222');
    const newRoute = new Route(createTime(1), createTime(2), line, vehicle);
    await em.persistAndFlush([line, vehicle, newRoute]);

    // when
    await controller.deleteRouteById(newRoute.id);
    const route = await em.refresh(newRoute, { filters: false });

    // then
    expect(route).toBeDefined();
    expect(route?.isActive).toBe(false);
  });

  it('should not create route with vehicle already in use', async () => {
    // given
    const line = new Line('145');
    const otherLine = new Line('134');
    const vehicle = new Vehicle('2222');
    const newRoute = new Route(createTime(1), createTime(2), line, vehicle);
    await em.persistAndFlush([line, otherLine, vehicle, newRoute]);

    // then
    await expect(
      controller.createRoute({
        line: otherLine.id,
        vehicle: vehicle.id,
        startTime: createTime(1.5).toISOString(),
        endTime: createTime(2.5).toISOString(),
      }),
    ).rejects.toThrow(BadRequestException);

    await expect(
      controller.createRoute({
        line: otherLine.id,
        vehicle: vehicle.id,
        startTime: createTime(0.5).toISOString(),
        endTime: createTime(1.5).toISOString(),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not colide with other vehicles', async () => {
    // given
    const line = new Line('145');
    const otherLine = new Line('134');
    const vehicle = new Vehicle('2222');
    const otherVehicle = new Vehicle('3333');
    const route = new Route(createTime(1), createTime(2), line, vehicle);
    await em.persistAndFlush([line, otherLine, vehicle, otherVehicle, route]);

    // then
    await expect(
      controller.createRoute({
        line: otherLine.id,
        vehicle: otherVehicle.id,
        startTime: createTime(0.5).toISOString(),
        endTime: createTime(2.5).toISOString(),
      }),
    ).resolves.toBeDefined();
  });

  it('should not create route with invalid time (three cases)', async () => {
    // see comment in RouteService.findRoutesInTimeRangeForVehicle for explanation

    // given
    const c1s = createTime(1);
    const c2s = createTime(2);
    const start = createTime(3);
    const c1e = createTime(4);
    const c3s = createTime(5);
    const end = createTime(6);
    const c2e = createTime(7);
    const c3e = createTime(8);

    const line = new Line('145');
    const newLine = new Line('134');
    const vehicle = new Vehicle('2222');
    const route = new Route(start, end, line, vehicle);
    await em.persistAndFlush([line, newLine, vehicle, route]);

    const testCase = async (startTime: Date, endTime: Date) => {
      return {
        line: newLine.id,
        vehicle: vehicle.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };
    };

    // then-bad
    await expect(controller.createRoute(await testCase(c1s, c1e))).rejects.toThrow(BadRequestException);
    await expect(controller.createRoute(await testCase(c2s, c2e))).rejects.toThrow(BadRequestException);
    await expect(controller.createRoute(await testCase(c3s, c3e))).rejects.toThrow(BadRequestException);

    // then-good
    await expect(controller.createRoute(await testCase(c1s, c2s))).resolves.toBeDefined();
    await expect(controller.createRoute(await testCase(c2e, c3e))).resolves.toBeDefined();
  });
});
