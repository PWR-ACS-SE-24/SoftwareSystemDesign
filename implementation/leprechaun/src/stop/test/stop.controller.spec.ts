import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { v7 as uuid } from 'uuid';
import { CreateStopDto } from '../controller/stop-create.dto';
import { StopController } from '../controller/stop.controller';
import { Stop } from '../database/stop.entity';
import { StopService } from '../service/stop.service';

const moduleMocker = new ModuleMocker(global);

const UUID_SAMPLE = '019411be-c6c3-7f67-83c1-c088d4280102';
const STOP: Stop = {
  id: UUID_SAMPLE,
  name: 'Klinii',
  longitude: 17.066399851202515,
  latitude: 51.10920279945731,
  isActive: true,
};
const STOPS: Stop[] = [STOP];

describe('StopController', () => {
  let controller: StopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StopController],
    })
      .useMocker((token) => {
        if (token === StopService) {
          const mocked: {
            [key in keyof StopService]: jest.Mock<StopService[key], Parameters<StopService[key]>>;
          } = {
            listAll: jest.fn().mockResolvedValue({ vehicles: STOPS, total: STOPS.length }),
            findStopById: jest.fn().mockResolvedValue(STOPS[0]),
            createStop: jest.fn().mockImplementation((newStop: CreateStopDto) => {
              const vehicle = { id: uuid(), ...newStop, isActive: true };
              STOPS.push(vehicle);
              return vehicle;
            }),
            deleteStopById: jest.fn().mockResolvedValue(undefined),
            updateStopById: jest.fn().mockResolvedValue(STOPS[0]),
          };
          return mocked;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<StopController>(StopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
