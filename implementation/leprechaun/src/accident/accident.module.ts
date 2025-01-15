import { RouteModule } from '@app/route/route.module';
import { SharedModule } from '@app/shared/shared.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccidentController } from './controller/accident.controller';
import { Accident } from './database/accident.entity';
import { AccidentService } from './service/accident.service';

@Module({
  imports: [MikroOrmModule.forFeature([Accident]), SharedModule, RouteModule],
  controllers: [AccidentController],
  providers: [AccidentService],
})
export class AccidentModule {}
