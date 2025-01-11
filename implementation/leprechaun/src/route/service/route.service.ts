import { LineService } from '@app/line/service/line.service';
import { Pagination } from '@app/shared/api/pagination.decorator';
import { VehicleService } from '@app/vehicle/service/vehicle.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRouteDto, UpdateRouteDto } from '../controller/route-create.dto';
import { Route } from '../database/route.entity';

@Injectable()
export class RouteService {
  constructor(
    private readonly em: EntityManager,
    private readonly vehicleService: VehicleService,
    private readonly lineService: LineService,

    @InjectRepository(Route)
    private readonly routeRepository: EntityRepository<Route>,
  ) {}

  async getAll(pagination: Pagination): Promise<{ routes: Route[]; total: number }> {
    const routes = await this.routeRepository.findAll({
      limit: pagination.size,
      offset: pagination.page * pagination.size,
      populate: ['line.mappings.stop', 'vehicle'],
    });
    const total = await this.routeRepository.count();

    return { routes, total };
  }

  private async findRoutesInTimeRangeForVehicle(
    vehicleId: string,
    newStartTime: Date,
    newOldTime: Date,
  ): Promise<Route[]> {
    /*
     * We have three cases to consider:
     * 1) New route starts before the other route and ends in the middle
     * 2) New route starts before the other route and ends after
     * 3) New route starts in the middle of the other route and ends after
     *
     * Old route is between <start> and <end>, all three cases are betweem (1), (2) and (3)
     *
     * ===(1)=(2)==<start>====(1)===(3)====<end>==(2)=(3)=====>
     *
     * 1) startTime < start < endTime < end
     *    ===sql===> startTime > newStartTime AND startTime < newOldTime AND endTime > newOldTime
     *
     * 2) startTime < start < end < endTime
     *    ===sql===> startTime > newStartTime AND endTime < newOldTime
     *
     * 3) start < startTime < end < endTime
     *    ===sql===> startTime < newStartTime AND endTime > newStartTime AND endTime < newOldTime
     */

    // prettier-ignore
    return await this.routeRepository.find({
      vehicle: vehicleId,
      $or: [
        /* 1) */ { startTime: { $gte: newStartTime, $lte: newOldTime }, endTime: {$gte: newOldTime} },
        /* 2) */ { startTime: { $gte: newStartTime }, endTime: { $lte: newOldTime } },
        /* 3) */ { startTime: { $lte: newStartTime }, endTime: { $gte: newStartTime, $lte: newOldTime } },
      ],
      isActive: true,
    });
  }

  async getRouteById(routeId: string, filters: boolean = true): Promise<Route> {
    return await this.routeRepository.findOneOrFail(
      { id: routeId },
      {
        failHandler: () => new NotFoundException({ details: routeId }),
        populate: ['line.mappings.stop', 'vehicle'],
        filters,
      },
    );
  }

  async createRoute(route: CreateRouteDto): Promise<Route> {
    const line = await this.lineService.getLineById(route.line);
    const vehicle = await this.vehicleService.getVehicleById(route.vehicle);

    const startTime = new Date(route.startTime);
    const endTime = new Date(route.endTime);

    // this is very much redundant here because of validator, but good sanity check
    if (new Date() > startTime || startTime > endTime) {
      // TODO: move me to a common function for use with updateRoute
      throw new BadRequestException({ details: 'Start time invalid' });
    }

    // find all routes for the vehicle in the time range, if there are any, throw an error
    if ((await this.findRoutesInTimeRangeForVehicle(vehicle.id, startTime, endTime)).length > 0) {
      throw new BadRequestException({ details: 'Vehicle is already being used in this time range' });
    }

    // all good, create the route
    const newRoute = new Route(startTime, endTime, line, vehicle);
    await this.em.persistAndFlush(newRoute);
    this.em.populate(newRoute, ['line.mappings.stop', 'vehicle']);
    return newRoute;
  }

  async updateRoute(routeId: string, newRoute: UpdateRouteDto): Promise<Route> {
    const oldRoute = await this.getRouteById(routeId);

    // select new values or keep the old ones
    // prettier-ignore
    const [startTime, endTime, line, vehicle] = [
      !!newRoute.startTime ? new Date(newRoute.startTime)                               : oldRoute.startTime,
      !!newRoute.endTime   ? new Date(newRoute.endTime)                                 : oldRoute.endTime,
      !!newRoute.line      ? await this.lineService.getLineById(newRoute.line)          : oldRoute.line,
      !!newRoute.vehicle   ? await this.vehicleService.getVehicleById(newRoute.vehicle) : oldRoute.vehicle,
    ];

    // same as in createRoute
    if (new Date() > startTime || startTime > endTime) {
      throw new BadRequestException({ details: 'Start time invalid' });
    }

    // find all routes for the vehicle in the time range
    const plannedRoutes = await this.findRoutesInTimeRangeForVehicle(vehicle.id, startTime, endTime);

    // if there are more than one route in the time range check whether its the same we are updating from
    plannedRoutes
      .filter((route) => route.id !== oldRoute.id)
      .map((_) => {
        throw new BadRequestException({ details: 'Vehicle is already being used in this time range' });
      });

    // set isActive to false and create a new one
    return this.em.transactional(async () => {
      await this.deleteRoute(routeId);
      const newRoute = new Route(startTime, endTime, line, vehicle);
      await this.em.persistAndFlush(newRoute);
      this.em.populate(newRoute, ['line.mappings.stop', 'vehicle']);
      return newRoute;
    });
  }

  async deleteRoute(routeId: string): Promise<void> {
    const updated = await this.routeRepository.nativeUpdate({ id: routeId, isActive: true }, { isActive: false });
    if (!updated) throw new NotFoundException({ details: routeId });
  }
}
