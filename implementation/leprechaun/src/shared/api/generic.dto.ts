import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export const UUIDApiProperty: ApiPropertyOptions = {
  description: 'ID',
  nullable: false,
  format: 'uuid',
  maxLength: 36,
  minLength: 36,
  examples: ['b4e9b1c1-9f7d-7b9b-8e9d-1c9f7d4b9b8e'],
};

export class GenericIdDto {
  @ApiProperty(UUIDApiProperty)
  readonly id!: string;
}

export class GenericIdActiveDto extends GenericIdDto {
  @ApiProperty({
    description: 'Stop status',
    nullable: false,
    examples: [true, false],
  })
  readonly isActive!: boolean;
}
