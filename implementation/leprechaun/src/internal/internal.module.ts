import { Module } from '@nestjs/common';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { RoutesController } from './routes/routes.controller';

@Module({
  controllers: [HealthcheckController, RoutesController]
})
export class InternalModule {}
