import { getConfiguredTestconfig } from '@app/config/mikro-orm.test.config';
import { Route, ROUTE_TRIGGER_NAME } from '@app/route/database/route.entity';
import { RouteModule } from '@app/route/route.module';
import { SharedModule } from '@app/shared/shared.module';
import { createRoute, createTimeOffsetFromNow, withoutTrigger } from '@app/shared/test/helpers';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { AccidentFilterOptions } from '../controller/accident-filter.decorator';
import { Accident, ACCIDENT_TRIGGER_NAME } from '../database/accident.entity';
import { AccidentService } from '../service/accident.service';

describe('AccidentServiceFilterTest', () => {
  let service: AccidentService;
  let em: EntityManager;
  let orm: MikroORM;
  let testCase: (filter: AccidentFilterOptions, expected: Array<number>) => Promise<void>;

  let times: Array<Date>;
  let routes: Array<Route>;
  let accidents: Array<Accident>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(getConfiguredTestconfig(process.env.JEST_WORKER_ID!)),
        MikroOrmModule.forFeature([Accident]),
        SharedModule,
        RouteModule,
      ],
      providers: [AccidentService],
    }).compile();

    service = module.get<AccidentService>(AccidentService);
    em = module.get<EntityManager>(EntityManager);
    orm = module.get<MikroORM>(MikroORM);
    await orm.getSchemaGenerator().createSchema();
  });

  afterEach(async () => {
    em.clear();
    await em.rollback();
  });
  afterAll(async () => {
    await orm.getSchemaGenerator().dropDatabase();
    await orm.close(true);
  });

  beforeEach(async () => {
    await em.begin();

    const { route: route0 } = createRoute({
      lineName: 'line',
      sideNumber: '123',
      routeStartTime: { hours: -1 },
      routeEndTime: { hours: 1 },
    });
    const { route: route1 } = createRoute({
      lineName: 'Lin2',
      sideNumber: '321',
      routeStartTime: { hours: -1 },
      routeEndTime: { hours: 1 },
    });
    const { route: route2 } = createRoute({
      lineName: '0L',
      sideNumber: '777',
      routeStartTime: { hours: -2 },
      routeEndTime: { hours: 1 },
    });
    routes = [route0, route1, route2];
    times = [
      /* 0 unused */ createTimeOffsetFromNow({ hours: 0, seconds: -70 }),
      /* 1 */ createTimeOffsetFromNow({ hours: 0, seconds: -60 }),
      /* 2 */ createTimeOffsetFromNow({ hours: 0, seconds: -50 }),
      /* 3 */ createTimeOffsetFromNow({ hours: 0, seconds: -40 }),
      /* 4 unused */ createTimeOffsetFromNow({ hours: 0, seconds: -35 }),
      /* 5 */ createTimeOffsetFromNow({ hours: 0, seconds: -30 }),
      /* 6 */ createTimeOffsetFromNow({ hours: 0, seconds: -20 }),
      /* 7 unused */ createTimeOffsetFromNow({ hours: 0, seconds: -15 }),
    ];
    accidents = [
      new Accident(times[1], 'acc0 for r0', route0, false),
      new Accident(times[2], 'acc1 for r0', route0, false),
      new Accident(times[3], 'acc0 for r1', route1, false),
      new Accident(times[5], 'acc1 for r1', route1, false),
      new Accident(times[6], 'acc0 for r2', route2, false),
    ];
    await withoutTrigger(orm, Route, ROUTE_TRIGGER_NAME, em.persistAndFlush(routes));
    await withoutTrigger(orm, Accident, ACCIDENT_TRIGGER_NAME, em.persistAndFlush(accidents));

    testCase = async (filter: AccidentFilterOptions, expected: Array<number>) => {
      // when
      const { accidents: foundAccidents, total } = await service.listAll({ page: 0, size: 10 }, filter);
      const foundAccidentIds = foundAccidents.map((l) => l.id);

      // then
      expect(foundAccidents).toHaveLength(total);
      expect(foundAccidentIds).toEqual(expected.map((l) => accidents[l].id));
    };
  });

  it('filterForVehicleSideNumberLike', async () => await testCase({ vehicleSideNumberLike: '2' }, [0, 1, 2, 3]));

  it('filterForLineNameLike', async () => await testCase({ lineNameLike: 'L' }, [2, 3, 4]));

  it('filterForTimeAfter I', async () => await testCase({ startTime: times[0] }, [0, 1, 2, 3, 4]));

  it('filterForTimeAfter II', async () => await testCase({ startTime: times[4] }, [3, 4]));

  it('filterForTimeAfter III', async () => await testCase({ startTime: times[7] }, []));

  it('filterForTimeBefore I', async () => await testCase({ endTime: times[0] }, []));

  it('filterForTimeBefore II', async () => await testCase({ endTime: times[4] }, [0, 1, 2])); // should be 3

  it('filterForTimeBefore III', async () => await testCase({ endTime: times[7] }, [0, 1, 2, 3, 4])); // should be 5
});
