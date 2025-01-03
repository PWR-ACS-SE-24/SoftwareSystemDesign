import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { Stop } from '../stop/database/stop.entity';
import { StopModule } from '../stop/stop.module';
import { LineController } from './controller/line.controller';
import { Line } from './database/line.entity';
import { StopLineMapping } from './database/stop-line-mapping.entity';
import { LineService } from './service/line.service';

@Module({
  imports: [MikroOrmModule.forFeature([Line, Stop, StopLineMapping]), StopModule, SharedModule],
  controllers: [LineController],
  providers: [LineService],
})
export class LineModule {}
