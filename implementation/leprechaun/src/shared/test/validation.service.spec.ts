import { ArgumentMetadata, Type } from '@nestjs/common';
import { PartialType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { SchemaMismatchException } from '../api/http-exceptions';
import { ValidateCreatePipe, ValidateUpdatePipe } from '../api/pipes';

class TestDto {
  @IsString()
  readonly text!: string;
}

class TestInheritanceDto extends TestDto {
  @IsString()
  readonly text2!: string;

  @IsNumber()
  readonly number!: number;

  @IsBoolean()
  readonly bool!: boolean;
}

class UpdateTestInheritanceDto extends PartialType(TestInheritanceDto) {}
class PickTypeTestInheritanceDto extends PickType(TestInheritanceDto, ['bool'] as const) {
  @IsString()
  readonly newText!: string;
}

export function getTestMetadata(type: Type<unknown>): ArgumentMetadata {
  return {
    type: 'body',
    metatype: type,
    data: '',
  };
}

describe('ValidationService', () => {
  it('should reject empty data for creation', async () => {
    await expect(ValidateCreatePipe.transform('', getTestMetadata(TestDto))).rejects.toThrow(SchemaMismatchException);
  });

  it('should not reject empty data for creation', async () => {
    await expect(
      ValidateCreatePipe.transform(<TestDto>{ text: 'eo' }, getTestMetadata(TestDto)),
    ).resolves.toBeDefined();
  });

  it('should not reject empty data for update', async () => {
    await expect(ValidateUpdatePipe.transform(<TestDto>{}, getTestMetadata(TestDto))).resolves.toBeDefined();
  });

  it('should not reject data for update', async () => {
    await expect(
      ValidateUpdatePipe.transform(<TestDto>{ text: 'eo' }, getTestMetadata(TestDto)),
    ).resolves.toBeDefined();
  });

  it('should throw for unknown fields', async () => {
    // given
    const data = <TestDto>{ text: 'eo', text2: 'oe' };

    // then
    await expect(ValidateCreatePipe.transform(data, getTestMetadata(TestDto))).rejects.toThrow(SchemaMismatchException);
    await expect(ValidateUpdatePipe.transform(data, getTestMetadata(TestDto))).rejects.toThrow(SchemaMismatchException);
  });

  it('should validate inheritance', async () => {
    // given
    const data = <TestInheritanceDto>{ text: 'eo', text2: 'oe', number: 1, bool: true };

    // then
    await expect(ValidateCreatePipe.transform(data, getTestMetadata(TestInheritanceDto))).resolves.toBeDefined();
    await expect(ValidateUpdatePipe.transform(data, getTestMetadata(TestInheritanceDto))).resolves.toBeDefined();
  });

  it('should validate inheritance with partial', async () => {
    // given
    const data = <UpdateTestInheritanceDto>{ text: 'eo', text2: 'oe' };

    // then
    await expect(ValidateUpdatePipe.transform(data, getTestMetadata(UpdateTestInheritanceDto))).resolves.toBeDefined();
  });

  it('should validate inheritance with pick', async () => {
    // given
    const data = <PickTypeTestInheritanceDto>{ bool: true, newText: 'oe' };

    // then
    await expect(
      ValidateCreatePipe.transform(data, getTestMetadata(PickTypeTestInheritanceDto)),
    ).resolves.toBeDefined();
    await expect(
      ValidateUpdatePipe.transform(data, getTestMetadata(PickTypeTestInheritanceDto)),
    ).resolves.toBeDefined();
  });

  it('should reject inheritance with pick', async () => {
    // given
    const data1 = <PickTypeTestInheritanceDto>{ bool: true, newText: 'oe', number: 1 };
    const data2 = <PickTypeTestInheritanceDto>{
      bool: true,
      newText: 'o e o ah ah ting tang walla walla bing bang',
      number: 1,
    };

    // then
    await expect(ValidateCreatePipe.transform(data1, getTestMetadata(PickTypeTestInheritanceDto))).rejects.toThrow(
      SchemaMismatchException,
    );

    await expect(ValidateUpdatePipe.transform(data1, getTestMetadata(PickTypeTestInheritanceDto))).rejects.toThrow(
      SchemaMismatchException,
    );

    await expect(ValidateCreatePipe.transform(data2, getTestMetadata(PickTypeTestInheritanceDto))).rejects.toThrow(
      SchemaMismatchException,
    );

    await expect(ValidateUpdatePipe.transform(data2, getTestMetadata(PickTypeTestInheritanceDto))).rejects.toThrow(
      SchemaMismatchException,
    );
  });
});
