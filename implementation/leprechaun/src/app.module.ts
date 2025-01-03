import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccidentModule } from './accident/accident.module';
import mikroOrmConfig from './config/mikro-orm.config';
import { InternalModule } from './internal/internal.module';
import { LineModule } from './line/line.module';
import { RouteModule } from './route/route.module';
import { SharedModule } from './shared/shared.module';
import { StopModule } from './stop/stop.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    StopModule,
    AccidentModule,
    LineModule,
    RouteModule,
    VehicleModule,
    InternalModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
