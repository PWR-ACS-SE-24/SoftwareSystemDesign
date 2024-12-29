import { Collection, Entity, Filter, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';
import { Line } from '../../line/database/line.entity';
import { StopLineMapping } from '../../line/database/stop-line-mapping.entity';

@Entity()
@Filter({ name: 'active', cond: { isActive: true }, default: true })
export class Stop {
  @PrimaryKey({ type: 'uuid' })
  id = uuidv7(); // TODO: redo as a custom type

  @Property({ length: 255, nullable: false })
  name: string;

  @Property({ type: 'float8', nullable: false })
  latitude: number;

  @Property({ type: 'float8', nullable: false })
  longitude: number;

  @Property({ nullable: false, default: true })
  isActive: boolean = true;

  @ManyToMany({ entity: () => Line, pivotEntity: () => StopLineMapping })
  lines = new Collection<Line>(this);

  constructor(name: string, latitude: number, longitude: number) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
