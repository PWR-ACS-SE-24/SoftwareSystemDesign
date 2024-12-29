import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker } from 'jest-mock';
import { v7 as uuid } from 'uuid';
import { CreateLineDto } from '../controller/line-create.dto';
import { LineController } from '../controller/line.controller';
import { Line } from '../database/line.entity';
import { LineService } from '../service/line.service';

const moduleMocker = new ModuleMocker(global);

const UUID_SAMPLE = '019411be-c6c3-7f67-83c1-c088d4280102';
const LINE: Line = {
  id: UUID_SAMPLE,
  name: 'Klinii',
  isActive: true,
};
const LINES: Line[] = [LINE];

describe('LineController', () => {
  let controller: LineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineController],
    })
      .useMocker((token) => {
        if (token === LineService) {
          const mocked: {
            [key in keyof LineService]: jest.Mock<LineService[key], Parameters<LineService[key]>>;
          } = {
            listAll: jest.fn().mockResolvedValue({ vehicles: LINES, total: LINES.length }),
            findLineById: jest.fn().mockResolvedValue(LINES[0]),
            createLine: jest.fn().mockImplementation((newLine: CreateLineDto) => {
              const vehicle = { id: uuid(), ...newLine, isActive: true };
              LINES.push(vehicle);
              return vehicle;
            }),
            deleteLineById: jest.fn().mockResolvedValue(undefined),
            updateLineById: jest.fn().mockResolvedValue(LINES[0]),
          };
          return mocked;
        }
      })
      .compile();

    controller = module.get<LineController>(LineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
