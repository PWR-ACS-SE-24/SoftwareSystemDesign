import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from '../../shared/api/validation.service';
import { Stop } from '../database/stop.entity';
import { StopService } from '../service/stop.service';

describe('StopService', () => {
  let service: StopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StopService,
        ValidationService,
        {
          provide: getRepositoryToken(Stop),
          useValue: {},
        },
        {
          provide: EntityManager,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StopService>(StopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
