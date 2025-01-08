import { DiscoveryModule, Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { SharedModule } from '../../shared/shared.module';
import { MonitoringController } from '../controller/monitoring.controller';
import { AuthGuard } from '../service/auth.guard';
import { MonitoringService } from '../service/monitoring.service';

describe('AuthGuard', () => {
  let reflector: Reflector;
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, DiscoveryModule],
      controllers: [MonitoringController],
      providers: [MonitoringService],
    }).compile();

    reflector = module.get<Reflector>(Reflector);
    guard = new AuthGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
