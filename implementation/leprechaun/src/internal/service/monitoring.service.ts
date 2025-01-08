import { Injectable, RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { RouteDto } from '../controller/routes.dto';
import { RoutePermissions } from './auth.guard';

@Injectable()
export class MonitoringService {
  constructor(
    private reflector: Reflector,
    private discovery: DiscoveryService,
  ) {}

  async getAllEndpoints(): Promise<RouteDto[]> {
    const routes = new Array<RouteDto>();
    const controllers = this.discovery.getControllers();

    for (const { instance } of controllers) {
      if (!instance) continue;
      const controllerPath = this.reflector.get<string>(PATH_METADATA, instance.constructor);
      if (!controllerPath.includes('/ext/')) continue;

      for (const classMethod of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
        const methodHandler = instance[classMethod];
        if (methodHandler === instance.constructor) continue;

        const methodPath = this.reflector.get<string>(PATH_METADATA, methodHandler);
        const httpMethod = this.reflector.get<number>(METHOD_METADATA, methodHandler);
        const roles = this.reflector.get<RoutePermissions[]>('roles', methodHandler) ?? [];

        routes.push(new RouteDto(RequestMethod[httpMethod], controllerPath + methodPath, roles));
      }
    }
    return routes;
  }
}
