import { RouteModule } from '@app/route/route.module';
import { SharedModule } from '@app/shared/shared.module';
import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MonitoringController } from './controller/monitoring.controller';
import { MonitoringService } from './service/monitoring.service';

@Module({
  imports: [SharedModule, DiscoveryModule, RouteModule],
  controllers: [MonitoringController],
  providers: [MonitoringService],
})
export class InternalModule {}
