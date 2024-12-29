import { Entity, Filter, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';
import { Stop } from '../../stop/database/stop.entity';
import { Line } from './line.entity';

@Entity()
@Filter({ name: 'active', cond: { isActive: true }, default: true })
export class StopLineMapping {
  @PrimaryKey({ type: 'uuid' })
  id = uuidv7(); // TODO: redo as a custom type

  @ManyToOne({ primary: false, entity: () => Line })
  line: Line;

  @ManyToOne({ primary: false, entity: () => Stop })
  stop: Stop;

  @Property({ nullable: false, type: 'integer' })
  order: number;

  [PrimaryKeyProp]?: ['id'];
}
