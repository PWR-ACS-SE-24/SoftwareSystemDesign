import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { LineController } from './controller/line.controller';
import { Line } from './database/line.entity';
import { LineService } from './service/line.service';

@Module({
  imports: [MikroOrmModule.forFeature([Line]), SharedModule],
  controllers: [LineController],
  providers: [LineService],
})
export class LineModule {}
