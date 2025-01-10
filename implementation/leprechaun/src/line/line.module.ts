import { SharedModule } from '@app/shared/shared.module';
import { Stop } from '@app/stop/database/stop.entity';
import { StopModule } from '@app/stop/stop.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { LineController } from './controller/line.controller';
import { Line } from './database/line.entity';
import { StopLineMapping } from './database/stop-line-mapping.entity';
import { LineService } from './service/line.service';

@Module({
  imports: [MikroOrmModule.forFeature([Line, Stop, StopLineMapping]), StopModule, SharedModule],
  controllers: [LineController],
  providers: [LineService],
  exports: [LineService],
})
export class LineModule {}
