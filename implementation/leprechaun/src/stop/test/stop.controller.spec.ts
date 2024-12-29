import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker } from 'jest-mock';
import { CreateStopDto } from '../controller/stop-create.dto';
import { StopController } from '../controller/stop.controller';
import { Stop } from '../database/stop.entity';
import { StopService } from '../service/stop.service';

const moduleMocker = new ModuleMocker(global);
jest.mock('../database/stop.entity');

const UUID_SAMPLE = '019411be-c6c3-7f67-83c1-c088d4280102';
const STOP: Stop = new Stop('Kliniki', 17.066399851202515, 51.10920279945731);
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
              const stop = new Stop(newStop.name, newStop.longitude, newStop.latitude);
              STOPS.push(stop);
              return stop;
            }),
            deleteStopById: jest.fn().mockResolvedValue(undefined),
            updateStopById: jest.fn().mockResolvedValue(STOPS[0]),
          };
          return mocked;
        }
      })
      .compile();

    controller = module.get<StopController>(StopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
