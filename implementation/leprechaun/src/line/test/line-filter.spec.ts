import { testConfig } from '@app/config/mikro-orm.test.config';
import { createLineWithStops } from '@app/shared/test/helpers';
import { Stop } from '@app/stop/database/stop.entity';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { LineFilterOptions } from '../controller/line-filter.decorator';
import { Line } from '../database/line.entity';
import { LineModule } from '../line.module';
import { LineService } from '../service/line.service';

describe('LineServiceFilterTest', () => {
  let service: LineService;
  let em: EntityManager;
  let orm: MikroORM;
  let testCase: (filter: LineFilterOptions, expected: Array<number>) => Promise<void>;

  let stops: Array<Stop>;
  let lines: Array<Line>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(testConfig), LineModule],
    }).compile();

    service = module.get<LineService>(LineService);
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

    stops = [stop1, stop2, stop3];

    const { line: line0, mappings: m0 } = createLineWithStops('L13', [stop1, stop3]);
    const { line: line1, mappings: m1 } = createLineWithStops('L123', [stop1, stop2, stop3]);
    const { line: line2, mappings: m2 } = createLineWithStops('L1', [stop1]);
    const { line: line3, mappings: m3 } = createLineWithStops('L23', [stop2, stop3]);

    lines = [line0, line1, line2, line3];

    await em.persistAndFlush([...m0, ...m1, ...m2, ...m3]);

    testCase = async (filter: LineFilterOptions, expected: Array<number>) => {
      // when
      const { lines: foundLines, total } = await service.listAll({ page: 0, size: 10 }, filter);
      const foundLineIds = foundLines.map((l) => l.id);

      // then
      expect(foundLines).toHaveLength(total);
      expect(foundLineIds).toEqual(expected.map((l) => lines[l].id));
    };
  });

  it('filterForStopNameLike', async () => await testCase({ stopNameLike: 'p1' }, [0, 1, 2]));
  it('filterForLineNameLike', async () => await testCase({ lineNameLike: '23' }, [1, 3]));
});
