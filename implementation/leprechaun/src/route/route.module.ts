import { LineModule } from '@app/line/line.module';
import { SharedModule } from '@app/shared/shared.module';
import { VehicleModule } from '@app/vehicle/vehicle.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RouteController } from './controller/route.controller';
import { Route } from './database/route.entity';
import { RouteService } from './service/route.service';

@Module({
  imports: [MikroOrmModule.forFeature([Route]), SharedModule, LineModule, VehicleModule],
  providers: [RouteService],
  controllers: [RouteController],
})
export class RouteModule {}
