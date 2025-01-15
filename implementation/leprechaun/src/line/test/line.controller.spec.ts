import { testConfig } from '@app/config/mikro-orm.test.config';
import { SharedModule } from '@app/shared/shared.module';
import { Stop } from '@app/stop/database/stop.entity';
import { StopService } from '@app/stop/service/stop.service';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { v7 } from 'uuid';
import { CreateLineDto } from '../controller/line-create.dto';
import { LineController } from '../controller/line.controller';
import { Line } from '../database/line.entity';
import { StopLineMapping } from '../database/stop-line-mapping.entity';
import { LineService } from '../service/line.service';

describe('LineController', () => {
  let controller: LineController;
  let em: EntityManager;
  let orm: MikroORM;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(testConfig),
        MikroOrmModule.forFeature([Stop, Line, StopLineMapping]),
        SharedModule,
      ],
      controllers: [LineController],
      providers: [LineService, StopService],
    }).compile();

    controller = module.get<LineController>(LineController);
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

  it('should return all lines', async () => {
    // given
    const newLine = new Line('1111');
    await em.persistAndFlush(newLine);

    // when
    const lines = await controller.getAllLines({ page: 0, size: 10 });

    // then
    expect(lines).toBeDefined();
    expect(lines.data).toHaveLength(1);
  });

  it('should return line by id', async () => {
    // given
    const newLine = new Line('1111');
    await em.persistAndFlush(newLine);

    // when
    const line = await controller.getLineById(newLine.id);

    // then
    expect(line).toBeDefined();
    expect(line.id).toEqual(newLine.id);
  });

  it('should create line', async () => {
    // given
    const newLine = <CreateLineDto>{ name: '1111', stops: [] };

    // when
    const lineResponse = await controller.createLine(newLine);

    // then
    expect(lineResponse.id).toBeDefined();
    expect(lineResponse.name).toEqual(newLine.name);
    const foundLine = await em.findOne(Line, { id: lineResponse.id });
    expect(foundLine).toBeDefined();
  });

  it('should not return lines marked as inactive', async () => {
    // given
    const newLine = new Line('1111');
    newLine.isActive = false;
    await em.persistAndFlush(newLine);

    // when
    const lines = await controller.getAllLines({ page: 0, size: 10 });

    // then
    expect(lines.data).toHaveLength(0);
  });

  it('update line', async () => {
    // given
    const newLine = new Line('1111');
    await em.persistAndFlush(newLine);

    // when
    const updatedLine = await controller.updateLine(newLine.id, { name: '2222' });

    // then
    expect(await em.count(Line, {}, { filters: false })).toEqual(2);
    expect(updatedLine.id).not.toEqual(newLine.id);
    expect(updatedLine.name).toEqual('2222');
  });

  it('should change isActive to false when deleting', async () => {
    // given
    const newLine = new Line('1111');
    await em.persistAndFlush(newLine);

    // when
    await controller.deleteLineById(newLine.id);

    // then
    const line = await em.findOne(Line, { id: newLine.id }, { filters: false });
    expect(line).toBeDefined();
    expect(line!.isActive).toEqual(false);
  });

  it('should be findable after deletion', async () => {
    // given
    const newLine = new Line('1111');
    await em.persistAndFlush(newLine);

    // when
    await controller.deleteLineById(newLine.id);
    const line = await controller.getLineById(newLine.id);

    // then
    expect(line.isActive).toEqual(false);
  });

  it('should return all stops for line', async () => {
    // given
    const stop = new Stop('PWR', 21.37, 37.21);
    await em.persistAndFlush(stop);
    const line = new Line('1111');
    await em.persistAndFlush(line);
    await em.persistAndFlush(new StopLineMapping(line, stop, 0));

    // when
    const lineResponse = await controller.getLineById(line.id);

    // then
    expect(lineResponse.id).toEqual(line.id);
    expect(lineResponse.stops).toHaveLength(1);
    expect(lineResponse.stops[0].id).toEqual(stop.id);
  });

  it('should add stop to line', async () => {
    // given
    const stop = new Stop('PWR', 21.37, 37.21);
    await em.persistAndFlush(stop);
    const line = new Line('1111');
    await em.persistAndFlush(line);

    // when
    const newLine = await controller.updateLine(line.id, { stops: [stop.id] });
    const lineResponse = await controller.getLineById(newLine.id);

    // then
    expect(lineResponse.id).not.toEqual(line.id);
    expect(await em.count(StopLineMapping)).toEqual(1);
    expect(lineResponse.stops).toHaveLength(1);
    expect(lineResponse.stops[0].id).toEqual(stop.id);
  });

  it('should keep order of stops', async () => {
    // given
    const stop1 = new Stop('PWR', 21.37, 37.21);
    await em.persistAndFlush(stop1);
    const stop2 = new Stop('PWR2', 2.3, 7.1);
    await em.persistAndFlush(stop2);
    const line = new Line('1111');
    await em.persistAndFlush(line);
    await em.persistAndFlush(new StopLineMapping(line, stop1, 0));
    await em.persistAndFlush(new StopLineMapping(line, stop2, 1));

    // when
    const newLine = await controller.updateLine(line.id, { stops: [stop2.id, stop1.id] });
    const lineResponse = await controller.getLineById(newLine.id);

    // then
    expect(lineResponse.stops).toHaveLength(2);
    expect(lineResponse.stops[0].id).toEqual(stop2.id);
    expect(lineResponse.stops[1].id).toEqual(stop1.id);
  });

  it('should remove stop from line', async () => {
    // given
    const stop = new Stop('PWR', 21.37, 37.21);
    await em.persistAndFlush(stop);
    const line = new Line('1111');
    await em.persistAndFlush(line);
    await em.persistAndFlush(new StopLineMapping(line, stop, 0));

    // when
    const newLine = await controller.updateLine(line.id, { stops: [] });
    const lineResponse = await controller.getLineById(newLine.id);

    // then
    expect(lineResponse.id).not.toEqual(line.id);
    expect(lineResponse.stops).toHaveLength(0);
  });

  it('should not allow to add non-existing stop', async () => {
    // given
    const line = new Line('1111');
    await em.persistAndFlush(line);

    // then
    await expect(controller.updateLine(line.id, { stops: [v7()] })).rejects.toThrow();
  });

  it('should not allow to create line with non-existing stop', async () => {
    // given
    const newLine = <CreateLineDto>{ name: '1111', stops: [v7()] };

    // then
    await expect(controller.createLine(newLine)).rejects.toThrow();
  });

  it('should not allow to add non-existing stop among existing stops', async () => {
    // given
    const stop = new Stop('PWR', 21.37, 37.21);
    await em.persistAndFlush(stop);
    const line = new Line('1111');
    await em.persistAndFlush(line);
    await em.persistAndFlush(new StopLineMapping(line, stop, 0));

    // then
    await expect(controller.updateLine(line.id, { stops: [stop.id, v7()] })).rejects.toThrow();
  });

  it('it allows for creation of multiple stops with the same id', async () => {
    // given
    const stop1 = new Stop('PWR', 21.37, 37.21);
    await em.persistAndFlush(stop1);
    const stop2 = new Stop('PWR2', 3.7, 2.1);
    await em.persistAndFlush(stop2);

    // when
    const newLine = await controller.createLine({ name: '1111', stops: [stop1.id, stop2.id, stop1.id] });
    const lineResponse = await controller.getLineById(newLine.id);

    // then
    expect(lineResponse.stops).toHaveLength(3);
    expect(lineResponse.stops[0].id).toEqual(stop1.id);
    expect(lineResponse.stops[1].id).toEqual(stop2.id);
    expect(lineResponse.stops[2].id).toEqual(stop1.id);
  });

  // TODO: add e2e tests (will test pipes)
});
