import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateLineDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4)
  @ApiProperty({
    description: 'Name of the line',
    maxLength: 4,
    minLength: 1,
    nullable: false,
    examples: ['112', '997', '144', '145'],
  })
  readonly name: string;

  @IsOptional()
  @IsArray({ always: true })
  @IsUUID('7', { each: true })
  @ApiProperty({
    description: 'Stops of the line',
    isArray: true,
    items: {
      type: 'string',
      format: 'uuid',
    },
    nullable: false,
    required: false,
    examples: [
      [
        'a7f8b7c0-2b4f-7b6e-9e1e-6f2b1b4c4f4d',
        '0194137a-3faf-70fb-8388-6586b32d9c8a',
        '0194137a-5f5b-701d-9230-bf55ce5bcba9',
      ],
    ],
  })
  readonly stops: string[];

  constructor(name: string, stops: string[] = []) {
    this.name = name;
    this.stops = stops;
  }
}

export class UpdateLineDto extends PartialType(CreateLineDto) {}
