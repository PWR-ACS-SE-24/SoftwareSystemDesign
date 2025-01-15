import { IsISO8601 } from 'class-validator';
import { IsLaterThan } from '../api/date-larger.validator';
import { ValidateCreatePipe } from '../api/pipes';
import { getTestMetadata } from './validation.service.spec';

class TestDto {
  @IsISO8601()
  startTime!: string;

  @IsISO8601()
  @IsLaterThan<TestDto>('startTime')
  endTime!: string;
}

describe('DateLargerValidator', () => {
  const startDate = '2021-01-01T00:00:00Z';
  const endDate = '2021-01-02T00:00:00Z';

  it('should accept valid dates', async () => {
    // given
    const data = <TestDto>{ startTime: startDate, endTime: endDate };

    // then
    await expect(ValidateCreatePipe.transform(data, getTestMetadata(TestDto))).resolves.toBeDefined();
  });

  it('should reject smaller dates', async () => {
    // given
    const data = <TestDto>{ startTime: endDate, endTime: startDate };

    // then
    await expect(ValidateCreatePipe.transform(data, getTestMetadata(TestDto))).rejects.toThrow();
  });

  it('should reject invalid dates', async () => {
    // given
    const data = <TestDto>{ startTime: 'nie powiem co', endTime: 'nie powiem kogo' };

    // then
    await expect(ValidateCreatePipe.transform(data, getTestMetadata(TestDto))).rejects.toThrow();
  });
});
