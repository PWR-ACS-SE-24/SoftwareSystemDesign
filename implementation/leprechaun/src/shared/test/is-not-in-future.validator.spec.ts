import { createTimeOffsetFromNow } from '@app/route/test/route.controller.spec';
import { IsISO8601 } from 'class-validator';
import { IsNotInFuture } from '../api/not-in-future.validator';
import { ValidateCreatePipe } from '../api/pipes';
import { getTestMetadata } from './validation.service.spec';

class TestIsNotInFutureDto {
  @IsISO8601()
  @IsNotInFuture()
  date!: string;
}

describe('IsNotInFutureValidator', () => {
  const dateInFuture = createTimeOffsetFromNow(+1).toISOString();
  const dateInPast = createTimeOffsetFromNow(-1).toISOString();

  it('should accept valid date', async () => {
    // given
    const data = <TestIsNotInFutureDto>{ date: dateInPast };

    // then
    await expect(ValidateCreatePipe.transform(data, getTestMetadata(TestIsNotInFutureDto))).resolves.toBeDefined();
  });

  it('should reject future date', async () => {
    // given
    const data = <TestIsNotInFutureDto>{ date: dateInFuture };

    // then
    await expect(ValidateCreatePipe.transform(data, getTestMetadata(TestIsNotInFutureDto))).rejects.toThrow();
  });

  it('should reject invalid date', async () => {
    // given
    const data = <TestIsNotInFutureDto>{ date: 'nie powiem co' };

    // then
    await expect(ValidateCreatePipe.transform(data, getTestMetadata(TestIsNotInFutureDto))).rejects.toThrow();
  });
});
