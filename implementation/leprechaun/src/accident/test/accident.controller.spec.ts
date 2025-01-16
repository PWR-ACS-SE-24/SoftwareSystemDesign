import { testConfig } from '@app/config/mikro-orm.test.config';
import { RouteModule } from '@app/route/route.module';
import { SharedModule } from '@app/shared/shared.module';
import { createRoute, createTimeOffsetFromNow } from '@app/shared/test/helpers';
import { DriverException, EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccidentController } from '../controller/accident.controller';
import { Accident } from '../database/accident.entity';
import { AccidentService } from '../service/accident.service';

describe('AccidentController', () => {
  let controller: AccidentController;
  let em: EntityManager;
  let orm: MikroORM;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(testConfig), MikroOrmModule.forFeature([Accident]), SharedModule, RouteModule],
      controllers: [AccidentController],
      providers: [AccidentService],
    }).compile();

    controller = module.get<AccidentController>(AccidentController);
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

  it('should return all accidents', async () => {
    // given
    const { route, line, vehicle } = createRoute('145', '2222', 1, 2);
    const newAccident = new Accident(createTimeOffsetFromNow(0, -10), 'description', route, false);
    await em.persistAndFlush([newAccident, line, vehicle]);

    // when
    const accidents = await controller.getAllAccidents({ page: 0, size: 10 });

    // then
    expect(accidents).toBeDefined();
    expect(accidents.data).toHaveLength(1);
    expect(accidents.data[0].id).toEqual(newAccident.id);
  });

  it('should return all accident ordered by time', async () => {
    // given
    const { route, line, vehicle } = createRoute('145', '2222', 1, 2);
    const newAccident1 = new Accident(createTimeOffsetFromNow(0, -5), 'description', route, false);
    const newAccident2 = new Accident(createTimeOffsetFromNow(0, -10), 'description', route, false);
    await em.persistAndFlush([newAccident1, newAccident2, line, vehicle]);

    // when
    const accidents = await controller.getAllAccidents({ page: 0, size: 10 });

    // then
    expect(accidents).toBeDefined();
    expect(accidents.data).toHaveLength(2);
    expect(accidents.data[0].id).toEqual(newAccident2.id);
    expect(accidents.data[1].id).toEqual(newAccident1.id);
  });

  it('should return accident by id', async () => {
    // given
    const { route, line, vehicle } = createRoute('145', '2222', 1, 2);
    const newAccident = new Accident(createTimeOffsetFromNow(0, -10), 'description', route, false);
    await em.persistAndFlush([newAccident, line, vehicle]);

    // when
    const accident = await controller.getAccidentById(newAccident.id);

    // then
    expect(accident).toBeDefined();
    expect(accident.id).toEqual(newAccident.id);
  });

  it('should create accident', async () => {
    // given
    const vehicleSideNumber = '2222';
    const { route, line, vehicle } = createRoute('145', vehicleSideNumber, 1, 2);
    await em.persistAndFlush([line, vehicle]);

    // when
    const newAccident = await controller.createAccident({
      route: route.id,
      time: createTimeOffsetFromNow(0, -1).toISOString(),
      description: 'description',
    });

    // then
    expect(newAccident).toBeDefined();
    expect(newAccident.route.id).toEqual(route.id);
    expect(newAccident.route.vehicleSideNumber).toEqual(vehicleSideNumber);
    expect(newAccident.description).toEqual('description');
    expect(newAccident.resolved).toEqual(false);
  });

  it('should not accept future accident time', async () => {
    // given
    const { route, line, vehicle } = createRoute('145', '2222', 1, 2);
    const accident = new Accident(createTimeOffsetFromNow(0, 10), 'description', route, false);

    // then
    await expect(() => em.persistAndFlush([line, vehicle])).rejects.toThrow(DriverException);
  });

  it('should update accident', async () => {
    // given
    const { route, line, vehicle } = createRoute('145', '2222', 1, 2);
    const newAccident = new Accident(createTimeOffsetFromNow(0, -10), 'description', route, false);
    await em.persistAndFlush([newAccident, line, vehicle]);

    // when
    const updatedAccident = await controller.updateAccident(newAccident.id, { description: 'new description' });

    // then
    expect(updatedAccident).toBeDefined();
    expect(updatedAccident.id).toEqual(newAccident.id);
    expect(updatedAccident.description).toEqual('new description');

    const accident = await em.findOneOrFail(Accident, { id: newAccident.id }, { filters: false });
    expect(accident.resolved).toEqual(false);
    expect(accident.description).toEqual('new description');
  });

  it('should resolve accident', async () => {
    // given
    const { route, line, vehicle } = createRoute('145', '2222', 1, 2);
    const newAccident = new Accident(createTimeOffsetFromNow(0, -10), 'description', route, false);
    await em.persistAndFlush([newAccident, line, vehicle]);

    // when
    await controller.resolveAccident(newAccident.id);

    // then
    const accident = await em.findOneOrFail(Accident, { id: newAccident.id }, { filters: false });
    expect(accident.resolved).toEqual(true);
  });

  it('should not resolve resolved accident', async () => {
    // given
    const { route, line, vehicle } = createRoute('145', '2222', 1, 2);
    const newAccident = new Accident(createTimeOffsetFromNow(0, -10), 'description', route, true);
    await em.persistAndFlush([newAccident, line, vehicle]);

    // then
    await expect(controller.resolveAccident(newAccident.id)).rejects.toThrow(BadRequestException);
  });

  it('should not update resolved accident', async () => {
    // given
    const { route, line, vehicle } = createRoute('145', '2222', 1, 2);
    const newAccident = new Accident(createTimeOffsetFromNow(0, -10), 'description', route, true);
    await em.persistAndFlush([newAccident, line, vehicle]);

    // then
    await expect(controller.updateAccident(newAccident.id, { description: 'new description' })).rejects.toThrow(
      BadRequestException,
    );
  });
});
