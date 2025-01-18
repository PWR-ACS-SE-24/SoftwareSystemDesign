import { IsDateString, IsOptional, IsString } from 'class-validator';
import { removeOffendingFields } from '../api/filter';

class TestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

describe('Filter', () => {
  it('should validate propper fields', () => {
    // given
    const data = {
      name: 'test',
      date: '2021-01-01',
    };

    // when
    const result = removeOffendingFields(data, TestDto);

    // then
    expect(result).toEqual(data);
  });

  it('should remove offending fields', () => {
    // given
    const data = {
      name: 'test',
      date: '2021-01-01',
      unknown: 'unknown',
    };

    // when
    const result = removeOffendingFields(data, TestDto);

    // then
    expect(result).toEqual({
      name: 'test',
      date: '2021-01-01',
    });
  });

  it('should validate wrong fields', () => {
    // given
    const data = {
      name: [123, 321],
      date: '2021-01-01',
    } as any as TestDto;

    // when
    const result = removeOffendingFields(data, TestDto);

    // then
    expect(result).toEqual({
      date: '2021-01-01',
    });
  });
});
