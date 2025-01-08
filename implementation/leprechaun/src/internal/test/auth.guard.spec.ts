import { Controller, ForbiddenException, Get, UnauthorizedException, UseGuards } from '@nestjs/common';
import { DiscoveryModule, Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { SharedModule } from '../../shared/shared.module';
import { MonitoringController } from '../controller/monitoring.controller';
import { AuthGuard, RequiredPermissions } from '../service/auth.guard';
import { MonitoringService } from '../service/monitoring.service';

@Controller('test')
@UseGuards(AuthGuard)
class TestController {
  @Get('/')
  @RequiredPermissions('admin', 'driver')
  test() {
    return 'test';
  }
}

const mockContext = (headers: Record<string, string>) => {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: headers,
      }),
    }),
    getHandler: () => TestController.prototype.test,
    getClass: () => TestController,
  };
};

describe('AuthGuard', () => {
  let reflector: Reflector;
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, DiscoveryModule],
      controllers: [MonitoringController, TestController],
      providers: [MonitoringService],
    }).compile();

    reflector = module.get<Reflector>(Reflector);
    guard = new AuthGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access to the route', () => {
    // given
    const adminContext = mockContext({ 'jp-user-role': 'admin' });
    const driverContext = mockContext({ 'jp-user-role': 'driver' });

    // then
    expect(guard.canActivate(adminContext as any)).toBe(true);
    expect(guard.canActivate(driverContext as any)).toBe(true);
  });

  it('should deny access to the route', () => {
    // given
    const guestContext = mockContext({ 'jp-user-role': 'guest' });
    const inspectorContext = mockContext({ 'jp-user-role': 'inspector' });

    // then
    expect(() => guard.canActivate(guestContext as any)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(inspectorContext as any)).toThrow(ForbiddenException);
  });

  it('should deny access to the route without header', () => {
    // given
    const context = mockContext({});

    // then
    expect(() => guard.canActivate(context as any)).toThrow(UnauthorizedException);
  });

  it('should deny access to the route with bad header', () => {
    // given
    const context = mockContext({ 'jp-user-role': 'drapala' });

    // then
    expect(() => guard.canActivate(context as any)).toThrow(UnauthorizedException);
  });
});
