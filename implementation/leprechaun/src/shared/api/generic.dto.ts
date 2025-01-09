import { ApiProperty } from '@nestjs/swagger';

export abstract class GenericIdDto {
  @ApiProperty({
    description: 'Stop ID',
    nullable: false,
    format: 'uuid',
    maxLength: 36,
    minLength: 36,
    examples: ['b4e9b1c1-9f7d-7b9b-8e9d-1c9f7d4b9b8e'],
  })
  readonly id: string;

  @ApiProperty({
    description: 'Stop status',
    nullable: false,
    examples: [true, false],
  })
  readonly isActive: boolean;

  constructor(id: string, isActive: boolean) {
    this.id = id;
    this.isActive = isActive;
  }
}
