import { Test, TestingModule } from '@nestjs/testing';
import { IsString } from 'class-validator';
import { SchemaMismatchException } from '../api/http-exceptions';
import { ValidationService } from '../api/validation.service';

class TestDto {
  @IsString()
  readonly text: string;

  constructor(text: any) {
    this.text = text;
  }
}

class TestInheritanceDto extends TestDto {
  @IsString()
  readonly text2: string;

  constructor(text: any, text2: any) {
    super(text);
    this.text2 = text2;
  }
}

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationService],
    }).compile();

    service = module.get<ValidationService>(ValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate DTO', async () => {
    const dto = new TestDto(123 as unknown as string);
    await expect(service.validate(dto)).rejects.toThrow(SchemaMismatchException);
  });

  it('should validate DTO with correct schema', async () => {
    const dto = new TestDto('123');
    await expect(service.validate(dto)).resolves.not.toThrow();
  });

  it('should not validate unknown types raw', async () => {
    const dto = {
      text: true,
      randomField: 'random',
    };
    await expect(service.validate(dto as unknown as TestDto)).rejects.toThrow(SchemaMismatchException);
  });

  it('should not allow for unknown types when updating', async () => {
    const dto = {
      text: '123',
      randomField: 'random',
    };
    await expect(service.validate(dto as unknown as TestDto, true)).rejects.toThrow(SchemaMismatchException);
  });

  it('should not validate unknown fields', async () => {
    const dto = new TestDto('123');
    (dto as any).randomField = 'random';

    await expect(service.validate(dto)).rejects.toThrow(SchemaMismatchException);
  });

  it('should not validate unknown fields when updating', async () => {
    const dto = new TestDto('123');
    (dto as any).randomField = 'random';

    await expect(service.validate(dto, true)).rejects.toThrow(SchemaMismatchException);
  });

  it('should validate inheritance', async () => {
    const dto = new TestInheritanceDto('123', '321');
    await expect(service.validate(dto)).resolves.not.toThrow();
  });
});
