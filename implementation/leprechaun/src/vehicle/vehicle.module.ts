import { SharedModule } from '@app/shared/shared.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { VehicleController } from './controller/vehicle.controller';
import { Vehicle } from './database/vehicle.entity';
import { VehicleService } from './service/vehicle.service';

@Module({
  imports: [MikroOrmModule.forFeature([Vehicle]), SharedModule],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
