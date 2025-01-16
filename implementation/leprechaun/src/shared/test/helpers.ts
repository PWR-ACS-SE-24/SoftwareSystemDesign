import { Line } from '@app/line/database/line.entity';
import { Route } from '@app/route/database/route.entity';
import { Vehicle } from '@app/vehicle/database/vehicle.entity';
import { MikroORM } from '@mikro-orm/core';

type TimeType = {
  hours: number;
  seconds?: number;
};

type Entity = {
  name: string;
};

export function createTimeOffsetFromNow({ hours, seconds }: TimeType): Date {
  if (seconds === undefined) {
    seconds = 0;
  }
  return new Date(new Date().valueOf() + (3600 * hours + seconds) * 1000);
}

export function createRoute({
  lineName,
  sideNumber,
  routeStartTime,
  routeEndTime,
}: {
  lineName: string;
  sideNumber: string;
  routeStartTime: TimeType;
  routeEndTime: TimeType;
}) {
  const line = new Line(lineName);
  const vehicle = new Vehicle(sideNumber);
  return {
    line,
    vehicle,
    route: new Route(createTimeOffsetFromNow(routeStartTime), createTimeOffsetFromNow(routeEndTime), line, vehicle),
  };
}

export async function withoutTrigger(orm: MikroORM, table: Entity, triggerName: string, fun: () => Promise<unknown>) {
  // Tested in internal-vehicles.controller.spec.ts
  const strategy = orm.config.getNamingStrategy();
  const tableName = strategy.classToTableName(table.name);
  const connection = orm.em.getConnection();

  await connection.execute(`ALTER TABLE ${tableName} DISABLE TRIGGER ${triggerName};`, [], 'run');
  await fun();
  await connection.execute(`ALTER TABLE ${tableName} ENABLE TRIGGER ${triggerName};`, [], 'run');
}
