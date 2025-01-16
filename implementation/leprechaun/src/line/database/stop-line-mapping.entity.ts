import { Stop } from '@app/stop/database/stop.entity';
import { Entity, Index, ManyToOne, PrimaryKey, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';
import { Line } from './line.entity';

@Entity()
@Unique<StopLineMapping>({ properties: ['line', 'stop', 'order'] })
export class StopLineMapping {
  @PrimaryKey({ type: 'uuid' })
  id = uuidv7();

  @Index()
  @ManyToOne({ primary: false, entity: () => Line })
  line: Line;

  @Index()
  @ManyToOne({ primary: false, entity: () => Stop })
  stop: Stop;

  @Property({ nullable: false, type: 'integer' })
  order: number;

  [PrimaryKeyProp]?: ['id'];

  constructor(line: Line, stop: Stop, order: number) {
    this.line = line;
    this.stop = stop;
    this.order = order;
  }
}
