import { AccidentRouteDto } from '@app/route/controller/route.dto';
import { GenericIdDto } from '@app/shared/api/generic.dto';
import { IsNotInFuture } from '@app/shared/api/not-in-future.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsISO8601, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Accident } from '../database/accident.entity';

export class AccidentDto extends GenericIdDto {
  @IsNotEmpty()
  @IsISO8601()
  @IsNotInFuture()
  @ApiProperty({
    description: 'Time of the accident',
    type: 'string',
    format: 'date-time',
    nullable: false,
    example: '2021-07-29T08:00:00.000Z',
  })
  readonly time: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Resolved status of the accident',
    default: true,
    nullable: false,
    example: false,
  })
  readonly resolved?: boolean;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Description of the accident',
    nullable: true,
    example: 'Styrta is on fire at the intersection of Wkoło Poczty and Łączna 43',
  })
  readonly description: string;

  @ApiProperty({
    description: 'Route of the accident',
    nullable: false,
    type: AccidentRouteDto,
  })
  readonly route: AccidentRouteDto;

  constructor(id: string, time: Date, description: string, route: AccidentRouteDto, resolved: boolean = false) {
    super(id);
    this.time = time.toISOString();
    this.resolved = resolved;
    this.description = description;
    this.route = route;
  }

  public static fromEntity(entity: Accident): AccidentDto {
    return new AccidentDto(
      entity.id,
      entity.time,
      entity.description,
      AccidentRouteDto.fromEntity(entity.route),
      entity.resolved,
    );
  }

  public static fromEntities(entities: Accident[]): AccidentDto[] {
    return entities.map(AccidentDto.fromEntity);
  }
}
