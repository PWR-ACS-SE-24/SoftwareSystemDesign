import { LineService } from '@app/line/service/line.service';
import { Pagination } from '@app/shared/api/pagination.decorator';
import { VehicleService } from '@app/vehicle/service/vehicle.service';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    newEndTime: Date,
  ): Promise<Route[]> {
    /* https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap/325964#325964
     * assumptions:
     * 1) route.startTime < route.endTime <- guaranteed by the database
     * 2) newStartTime < newEndTime       <- have to be guaranteed by the caller
     *
     * --> (route.startTime <= newEndTime) AND (route.endTime >= newStartTime)
     */

    return await this.routeRepository.find({
      vehicle: vehicleId,
      $and: [{ startTime: { $lte: newEndTime } }, { endTime: { $gte: newStartTime } }],
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

  async getRouteByVehicleSideNumber(vehicleSideNumber: string, filters: boolean = true): Promise<Route> {
    const now = new Date();

    return await this.routeRepository.findOneOrFail(
      {
        vehicle: { sideNumber: vehicleSideNumber },
        $and: [{ startTime: { $lte: now } }, { endTime: { $gte: now } }],
      },
      {
        failHandler: () => new NotFoundException({ details: vehicleSideNumber }),
        populate: ['vehicle', 'line'],
        filters, // filters in both route and vehicle should be set
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
      // this should be a 400, but the validator should catch it thus 500
      throw new InternalServerErrorException({ details: 'Start time invalid' });
    }

    const newRoute = await this.em.transactional(async () => {
      // find all routes for the vehicle in the time range, if there are any, throw an error
      if ((await this.findRoutesInTimeRangeForVehicle(vehicle.id, startTime, endTime)).length > 0) {
        throw new BadRequestException({ details: 'Vehicle is already being used in this time range' });
      }

      // all good, create the route
      const newRoute = new Route(startTime, endTime, line, vehicle);
      await this.em.persistAndFlush(newRoute);
      return newRoute;
    });

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
    return await this.em.transactional(async () => {
      const plannedRoutes = await this.findRoutesInTimeRangeForVehicle(vehicle.id, startTime, endTime);

      // if there are more than one route in the time range check whether its the same we are updating from
      if (plannedRoutes.some((route) => route.id !== oldRoute.id)) {
        throw new BadRequestException({ details: 'Vehicle is already being used in this time range' });
      }

      // set isActive to false and create a new one
      await this.deleteRoute(routeId);
      const newRoute = new Route(startTime, endTime, line, vehicle);
      await this.em.persistAndFlush(newRoute);
      return newRoute;
    });
  }

  async deleteRoute(routeId: string): Promise<void> {
    const updated = await this.routeRepository.nativeUpdate({ id: routeId, isActive: true }, { isActive: false });
    if (!updated) throw new NotFoundException({ details: routeId });
  }
}
