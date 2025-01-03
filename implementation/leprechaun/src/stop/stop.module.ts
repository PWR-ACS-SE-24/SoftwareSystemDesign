import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { StopController } from './controller/stop.controller';
import { Stop } from './database/stop.entity';
import { StopService } from './service/stop.service';

@Module({
  imports: [MikroOrmModule.forFeature([Stop]), SharedModule],
  controllers: [StopController],
  providers: [StopService],
})
export class StopModule {}
