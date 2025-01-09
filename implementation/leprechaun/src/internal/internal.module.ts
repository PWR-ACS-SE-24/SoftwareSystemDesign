import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { SharedModule } from '../shared/shared.module';
import { MonitoringController } from './controller/monitoring.controller';
import { MonitoringService } from './service/monitoring.service';

@Module({
  imports: [SharedModule, DiscoveryModule],
  controllers: [MonitoringController],
  providers: [MonitoringService],
})
export class InternalModule {}
