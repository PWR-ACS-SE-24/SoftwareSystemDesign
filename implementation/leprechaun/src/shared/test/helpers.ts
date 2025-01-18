import { Line } from '@app/line/database/line.entity';
import { StopLineMapping } from '@app/line/database/stop-line-mapping.entity';
import { Route } from '@app/route/database/route.entity';
import { Stop } from '@app/stop/database/stop.entity';
import { Vehicle } from '@app/vehicle/database/vehicle.entity';
import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

export type TimeType = {
  hours: number;
  seconds?: number;
};

type Entity = {
  name: string;
};

export type FuncOrPromise<T = unknown> = (() => Promise<T>) | Promise<T>;

export function createTimeOffsetFromNow({ hours, seconds }: TimeType): Date {
  if (seconds === undefined) {
    seconds = 0;
  }
  return new Date(new Date().valueOf() + (3600 * hours + seconds) * 1000);
}

export function createLineWithStops(
  lineName: string,
  stops: Array<Stop>,
): { line: Line; mappings: Array<StopLineMapping> } {
  const line = new Line(lineName);
  const mappings = stops.map((stop, index) => new StopLineMapping(line, stop, index));
  return { line, mappings };
}

export function createRoute({
  lineName,
  sideNumber,
  routeStartTime,
  routeEndTime,
}: {
  lineName: string | Line;
  sideNumber: string | Vehicle;
  routeStartTime: TimeType;
  routeEndTime: TimeType;
}) {
  const line = typeof lineName === 'string' ? new Line(lineName) : lineName;
  const vehicle = typeof sideNumber === 'string' ? new Vehicle(sideNumber) : sideNumber;
  return {
    line,
    vehicle,
    route: new Route(createTimeOffsetFromNow(routeStartTime), createTimeOffsetFromNow(routeEndTime), line, vehicle),
  };
}

export async function withoutTrigger(orm: MikroORM, table: Entity, triggerName: string, fun: FuncOrPromise) {
  // Tested in internal-vehicles.controller.spec.ts
  const strategy = orm.config.getNamingStrategy();
  const tableName = strategy.classToTableName(table.name);
  const entityManager = orm.em as EntityManager;
  await orm.em.transactional(async () => {
    await entityManager.execute(`ALTER TABLE ${tableName} DISABLE TRIGGER ${triggerName};`, [], 'run');
    await (typeof fun === 'function' ? fun() : fun);
    await entityManager.execute(`ALTER TABLE ${tableName} ENABLE TRIGGER ${triggerName};`, [], 'run');
  });
}
