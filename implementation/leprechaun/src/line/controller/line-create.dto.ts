import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { LineDto } from './line.dto';

export class CreateLineDto extends PickType(LineDto, ['name'] as const) {
  readonly name!: string;

  @IsOptional()
  @IsArray()
  @IsUUID('7', { each: true })
  @ApiProperty({
    description: 'Stops of the line',
    type: 'array',
    items: {
      type: 'string',
      format: 'uuid',
    },
    nullable: true,
    required: false,
    examples: [
      [
        'a7f8b7c0-2b4f-7b6e-9e1e-6f2b1b4c4f4d',
        '0194137a-3faf-70fb-8388-6586b32d9c8a',
        '0194137a-5f5b-701d-9230-bf55ce5bcba9',
      ],
    ],
  })
  readonly stops?: string[];
}

export class UpdateLineDto extends PartialType(CreateLineDto) {}
