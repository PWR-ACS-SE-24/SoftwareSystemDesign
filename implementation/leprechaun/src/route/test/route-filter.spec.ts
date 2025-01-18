import { testConfig } from '@app/config/mikro-orm.test.config';
import { Line } from '@app/line/database/line.entity';
import { LineModule } from '@app/line/line.module';
import { SharedModule } from '@app/shared/shared.module';
import { createLineWithStops, createRoute, createTimeOffsetFromNow, TimeType } from '@app/shared/test/helpers';
import { Stop } from '@app/stop/database/stop.entity';
import { Vehicle } from '@app/vehicle/database/vehicle.entity';
import { VehicleModule } from '@app/vehicle/vehicle.module';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { RouteFilterOptions } from '../controller/route-filter.decorator';
import { Route } from '../database/route.entity';
import { RouteService } from '../service/route.service';

describe('RouteServiceFilterTest', () => {
  let service: RouteService;
  let em: EntityManager;
  let orm: MikroORM;

  let testCase: (filter: RouteFilterOptions, expected: Array<number>) => Promise<void>;

  let lines: Array<Line>;
  let vehicles: Array<Vehicle>;
  let routes: Array<Route>;
  let times: Array<Date>;

  let before: Date;
  let mid: Date;
  let after: Date;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(testConfig),
        MikroOrmModule.forFeature([Route]),
        SharedModule,
        LineModule,
        VehicleModule,
      ],
      providers: [RouteService],
    }).compile();

    service = module.get<RouteService>(RouteService);
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

    const stop1 = new Stop('stop1', 1, 1);
    const stop2 = new Stop('2pots', 2, 2);
    const stop3 = new Stop('stop3', 3, 3);

    const { line: line0 } = createLineWithStops('L13', [stop1, stop3]);
    const { line: line1 } = createLineWithStops('L123', [stop1, stop2, stop3]);
    const { line: line2 } = createLineWithStops('L1', [stop1]);
    const { line: line3 } = createLineWithStops('L23', [stop2, stop3]);
    const { line: line4 } = createLineWithStops('L3', [stop3]);

    lines = [line0, line1, line2, line3];
    vehicles = [
      new Vehicle('1234') /* 0 */,
      new Vehicle('5678') /* 1 */,
      new Vehicle('9012') /* 2 */,
      new Vehicle('3456') /* 3 */,
    ];

    const route = (l: Line, v: Vehicle, start: TimeType, end: TimeType) => {
      return createRoute({
        lineName: l,
        sideNumber: v,
        routeStartTime: start,
        routeEndTime: end,
      })['route'];
    };
    /*                                   {       startTime       }  {         endTime       } */
    const r0 = route(line0, vehicles[0], { hours: +0, seconds: 1 }, { hours: +1, seconds: 7 });
    const r1 = route(line0, vehicles[0], { hours: +0, seconds: 2 }, { hours: +4, seconds: 6 });
    const r2 = route(line1, vehicles[1], { hours: +2, seconds: 3 }, { hours: +3, seconds: 5 });
    const r3 = route(line2, vehicles[2], { hours: +2, seconds: 4 }, { hours: +5, seconds: 4 });
    const r4 = route(line3, vehicles[3], { hours: +2, seconds: 5 }, { hours: +3, seconds: 3 });
    const r5 = route(line3, vehicles[3], { hours: +4, seconds: 6 }, { hours: +5, seconds: 2 });
    const r6 = route(line4, vehicles[0], { hours: +5, seconds: 7 }, { hours: +6, seconds: 1 });

    routes = [r0, r1, r2, r3, r4, r5, r6];

    before = createTimeOffsetFromNow({ hours: -0.5 }); // before all routes
    mid = createTimeOffsetFromNow({ hours: +2.5 });
    after = createTimeOffsetFromNow({ hours: +6.5 }); // after all routes

    testCase = async (filter: RouteFilterOptions, expected: Array<number>) => {
      // when
      const { routes: foundRoutes, total } = await service.listAll({ page: 0, size: 10 }, filter);
      const foundRouteIds = foundRoutes.map((l, _) => l.id);

      // then
      expect(foundRouteIds).toEqual(expected.map((l) => routes[l].id));
      expect(foundRoutes).toHaveLength(total);
    };

    await em.persistAndFlush(routes);
  });

  it('filterForLineNameLike', async () => await testCase({ lineNameLike: '23' }, [2, 4, 5]));

  it('filterForStopNameLike', async () => await testCase({ stopNameLike: 'p1' }, [0, 1, 2, 3]));

  it('filterForVehicleSideNumberLike', async () => await testCase({ vehicleSideNumberLike: '4' }, [0, 1, 4, 5, 6]));

  it('filterForStartTimeAfter I', async () => await testCase({ startTimeAfter: before }, [0, 1, 2, 3, 4, 5, 6]));

  it('filterForStartTimeAfter II', async () => await testCase({ startTimeAfter: mid }, [5, 6]));

  it('filterForStartTimeAfter III', async () => await testCase({ startTimeAfter: after }, []));

  it('filterForStartTimeBefore I', async () => await testCase({ startTimeBefore: before }, []));

  it('filterForStartTimeBefore II', async () => await testCase({ startTimeBefore: mid }, [0, 1, 2, 3, 4]));

  it('filterForStartTimeBefore III', async () => await testCase({ startTimeBefore: after }, [0, 1, 2, 3, 4, 5, 6]));

  it('filterForEndTimeAfter I', async () => await testCase({ endTimeAfter: before }, [0, 1, 2, 3, 4, 5, 6]));

  it('filterForEndTimeAfter II', async () => await testCase({ endTimeAfter: mid }, [1, 2, 3, 4, 5, 6]));

  it('filterForEndTimeAfter III', async () => await testCase({ endTimeAfter: after }, []));

  it('filterForEndTimeBefore I', async () => await testCase({ endTimeBefore: before }, []));

  it('filterForEndTimeBefore II', async () => await testCase({ endTimeBefore: mid }, [0]));

  it('filterForEndTimeBefore III', async () => await testCase({ endTimeBefore: after }, [0, 1, 2, 3, 4, 5, 6]));
});
