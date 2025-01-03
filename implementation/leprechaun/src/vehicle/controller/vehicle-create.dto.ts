import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  @ApiProperty({
    description: 'Side number of the vehicle',
    maxLength: 16,
    minLength: 1,
    nullable: false,
    examples: ['2137', '94102-3170150114'],
  })
  readonly sideNumber: string;

  constructor(sideNumber: string) {
    this.sideNumber = sideNumber;
  }
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
