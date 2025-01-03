import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { testConfig } from '../../config/mikro-orm.test.config';
import { Line } from '../../line/database/line.entity';
import { StopLineMapping } from '../../line/database/stop-line-mapping.entity';
import { LineService } from '../../line/service/line.service';
import { SharedModule } from '../../shared/shared.module';
import { CreateStopDto } from '../controller/stop-create.dto';
import { StopController } from '../controller/stop.controller';
import { Stop } from '../database/stop.entity';
import { StopService } from '../service/stop.service';

describe('StopController', () => {
  let controller: StopController;
  let em: EntityManager;
  let orm: MikroORM;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(testConfig),
        MikroOrmModule.forFeature([Stop, Line, StopLineMapping]),
        SharedModule,
      ],
      controllers: [StopController],
      providers: [StopService, LineService],
    }).compile();

    controller = module.get<StopController>(StopController);
    em = module.get<EntityManager>(EntityManager);
    orm = module.get<MikroORM>(MikroORM);
    await em.begin();
  });

  afterEach(async () => {
    await em.rollback();
    await orm.close(true);
  });

  it('should return all stops', async () => {
    // given
    const newStop = new Stop('Kliniki', 17.066399851202515, 51.10920279945731);
    await em.persistAndFlush(newStop);

    // when
    const stops = await controller.getAllStops();

    // then
    expect(Object.keys(stops)).toMatchObject(['total', 'size', 'page', 'data']);
    expect(stops.data).toHaveLength(1);
    expect(stops.data[0].id).toEqual(newStop.id);
  });

  it('should return stops by id', async () => {
    // given
    const newStop = new Stop('Kliniki', 17.066399851202515, 51.10920279945731);
    await em.persistAndFlush(newStop);

    // when
    const stop = await controller.getStopById(newStop.id);

    // then
    expect(stop.id).toEqual(newStop.id);
    expect(stop.name).toEqual(newStop.name);
    expect(stop.latitude).toEqual(newStop.latitude);
    expect(stop.longitude).toEqual(newStop.longitude);
    expect(stop.isActive).toEqual(true);
  });

  it('should create a stop', async () => {
    // given
    const stop = new CreateStopDto('PWR', 21.37, 37.21);

    // when
    const stopResponse = await controller.createStop(stop);

    // then
    expect(stopResponse.id).toBeDefined();
    expect(stopResponse.name).toEqual(stop.name);
    expect(stopResponse.latitude).toEqual(stop.latitude);
    expect(stopResponse.longitude).toEqual(stop.longitude);
    expect(stopResponse.isActive).toEqual(true);
    const newStop = await em.findOne(Stop, { id: stopResponse.id });
    expect(newStop).toBeDefined();
  });

  it('should not return stops marked as inactive', async () => {
    // given
    const newStop = new Stop('PWR', 21.37, 37.21);
    newStop.isActive = false;
    await em.persistAndFlush(newStop);

    // when
    const stops = await controller.getAllStops();

    // then
    expect(stops.data).toHaveLength(0);
  });

  it('should paginate stops', async () => {
    // given
    await em.persistAndFlush(new Stop('PWR', 21.37, 37.21));
    await em.persistAndFlush(new Stop('PWR2', 2.3, 7.1));

    // when
    const stopsP1 = await controller.getAllStops(0, 1);
    const stopsP2 = await controller.getAllStops(1, 1);

    // then
    expect(stopsP1.data).toHaveLength(1);
    expect(stopsP2.data).toHaveLength(1);
  });

  it('should sanitize pageing', async () => {
    // given
    await em.persistAndFlush(new Stop('PWR', 21.37, 37.21));
    await em.persistAndFlush(new Stop('PWR2', 2.3, 7.1));

    // when
    const stops = await controller.getAllStops(-3, 4345);

    // then
    expect(stops.data).toHaveLength(2);
    expect(stops.total).toEqual(2);
    expect(stops.size).toEqual(100);
    expect(stops.page).toEqual(0);
  });

  it('should update stop', async () => {
    // given
    const stop = new Stop('PWR', 21.37, 37.21);
    await em.persistAndFlush(stop);

    // when
    const newStop = await controller.updateStopById(stop.id, { name: 'PWR2' });
    const oldStop = await em.refresh(stop, { filters: false });

    // then
    expect(oldStop.isActive).toEqual(false);
    expect(oldStop.id).not.toEqual(newStop.id);
    expect(await em.count(Stop, {}, { filters: false })).toEqual(2);
    expect(newStop.id).not.toEqual(stop.id);
    expect(newStop.name).toEqual('PWR2');
  });

  it('should change isActive to false when deleting', async () => {
    // given
    const newStop = new Stop('PWR', 21.37, 37.21);
    await em.persistAndFlush(newStop);

    // when
    await controller.deleteStopById(newStop.id);

    // then
    const stop = await em.refresh(newStop, { filters: false });
    expect(stop.isActive).toEqual(false);
  });

  it('should be findable after deletion', async () => {
    // given
    const newStop = new Stop('PWR', 21.37, 37.21);
    await em.persistAndFlush(newStop);

    // when
    await controller.deleteStopById(newStop.id);
    const stop = await controller.getStopById(newStop.id);

    // then
    expect(stop.isActive).toEqual(false);
  });

  // TODO: add tests with lines
  // TODO: add e2e tests (will test pipes)
});
