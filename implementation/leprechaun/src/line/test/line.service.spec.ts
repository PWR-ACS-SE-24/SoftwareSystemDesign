import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from '../../shared/api/validation.service';
import { Line } from '../database/line.entity';
import { LineService } from '../service/line.service';

describe('LineService', () => {
  let service: LineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidationService,
        LineService,
        { provide: getRepositoryToken(Line), useValue: {} },
        { provide: EntityManager, useValue: {} },
      ],
    }).compile();

    service = module.get<LineService>(LineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
