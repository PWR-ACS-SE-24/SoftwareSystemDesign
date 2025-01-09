import { DiscoveryModule } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { SharedModule } from '../../shared/shared.module';
import { MonitoringController } from '../controller/monitoring.controller';
import { MonitoringService } from '../service/monitoring.service';

describe('HealthcheckController', () => {
  let controller: MonitoringController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, DiscoveryModule],
      controllers: [MonitoringController],
      providers: [MonitoringService],
    }).compile();

    controller = module.get<MonitoringController>(MonitoringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
