import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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

  constructor(name: string) {
    this.name = name;
  }
}

export class UpdateLineDto extends PartialType(CreateLineDto) {}
