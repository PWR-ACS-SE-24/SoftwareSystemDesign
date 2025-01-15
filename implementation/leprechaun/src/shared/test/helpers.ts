import { Line } from '@app/line/database/line.entity';
import { Route } from '@app/route/database/route.entity';
import { Vehicle } from '@app/vehicle/database/vehicle.entity';

export function createTimeOffsetFromNow(hours: number, seconds: number = 0): Date {
  return new Date(new Date().valueOf() + (3600 * hours + seconds) * 1000);
}

export function createRoute(lineName: string, sideNumber: string, routeStartHours: number, routeEndHours: number) {
  const line = new Line(lineName);
  const vehicle = new Vehicle(sideNumber);
  return {
    line,
    vehicle,
    route: new Route(
      createTimeOffsetFromNow(routeStartHours, -1),
      createTimeOffsetFromNow(routeEndHours, -1),
      line,
      vehicle,
    ),
  };
}
