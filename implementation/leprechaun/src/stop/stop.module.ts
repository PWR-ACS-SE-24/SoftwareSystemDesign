import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { StopLineMapping } from '../line/database/stop-line-mapping.entity';
import { LineModule } from '../line/line.module';
import { SharedModule } from '../shared/shared.module';
import { StopController } from './controller/stop.controller';
import { Stop } from './database/stop.entity';
import { StopService } from './service/stop.service';

@Module({
  imports: [MikroOrmModule.forFeature([Stop, StopLineMapping]), forwardRef(() => LineModule), SharedModule],
  controllers: [StopController],
  providers: [StopService],
  exports: [StopService],
})
export class StopModule {}
