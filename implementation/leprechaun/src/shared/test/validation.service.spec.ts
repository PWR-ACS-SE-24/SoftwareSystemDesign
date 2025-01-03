import { ArgumentMetadata, Type } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { SchemaMismatchException } from '../api/http-exceptions';
import { ValidateCreatePipe, ValidateUpdatePipe } from '../api/pipes';

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

  @IsNumber()
  readonly number: number;

  @IsBoolean()
  readonly bool: boolean;

  constructor(text: any, text2: any) {
    super(text);
    this.text2 = text2;
    this.number = 1;
    this.bool = true;
  }
}

class UpdateTestInheritanceDto extends PartialType(TestInheritanceDto) {}

function getTestMetadata(type: Type<unknown>): ArgumentMetadata {
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
});
