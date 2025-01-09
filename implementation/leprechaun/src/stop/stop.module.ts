import { StopLineMapping } from '@app/line/database/stop-line-mapping.entity';
import { LineModule } from '@app/line/line.module';
import { SharedModule } from '@app/shared/shared.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
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
