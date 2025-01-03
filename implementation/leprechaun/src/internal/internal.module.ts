import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { MonitoringController } from './controller/monitoring.controller';

@Module({
  imports: [SharedModule],
  controllers: [MonitoringController],
})
export class InternalModule {}
