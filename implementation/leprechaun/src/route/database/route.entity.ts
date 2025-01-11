import { Line } from '@app/line/database/line.entity';
import { Vehicle } from '@app/vehicle/database/vehicle.entity';
import { Entity, Filter, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

@Entity()
@Filter({ name: 'active', cond: { isActive: true }, default: true })
export class Route {
  @PrimaryKey({ type: 'uuid' })
  id = uuidv7(); // TODO: redo as a custom type

  @Property({ nullable: false, default: true })
  isActive: boolean = true;

  @Property({ nullable: false, type: 'timestamp' })
  startTime: Date;

  @Property({ nullable: false, type: 'timestamp' })
  endTime: Date;

  @ManyToOne({ nullable: false, entity: () => Line })
  line: Line;

  @ManyToOne({ nullable: false, entity: () => Vehicle })
  vehicle: Vehicle;

  constructor(startTime: Date, endTime: Date, line: Line, vehicle: Vehicle) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.line = line;
    this.vehicle = vehicle;
  }
}
