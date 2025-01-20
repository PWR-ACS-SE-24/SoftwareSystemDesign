import { StopLineMapping } from '@app/line/database/stop-line-mapping.entity';
import { Check, Collection, Entity, Filter, Index, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

@Entity()
@Filter({ name: 'active', cond: { isActive: true }, default: true })
@Check<Stop>({ name: 'stop_name_check', expression: (columns) => `${columns.name} <> ''` })
@Index<Stop>({ name: 'stop_name_index', properties: ['name'], type: 'fulltext' })
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

  @OneToMany({
    entity: () => StopLineMapping,
    mappedBy: (StopLineMapping) => StopLineMapping.stop,
    orderBy: { order: 'ASC' },
  })
  mappings = new Collection<StopLineMapping>(this);

  constructor(name: string, latitude: number, longitude: number) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
