import { Collection, Entity, Filter, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';
import { Stop } from '../../stop/database/stop.entity';
import { StopLineMapping } from './stop-line-mapping.entity';

@Entity()
@Filter({ name: 'active', cond: { isActive: true }, default: true })
export class Line {
  @PrimaryKey({ type: 'uuid' })
  id = uuidv7(); // TODO: redo as a custom type

  @Property({ length: 4, nullable: false })
  name: string;

  @Property({ nullable: false, default: true })
  isActive: boolean = true;

  @ManyToMany({ entity: () => Stop, mappedBy: (o) => o.lines, pivotEntity: () => StopLineMapping })
  stops = new Collection<Stop>(this);

  constructor(name: string) {
    this.name = name;
  }
}
