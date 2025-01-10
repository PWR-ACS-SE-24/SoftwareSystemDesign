import { Stop } from '@app/stop/database/stop.entity';
import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';
import { Line } from './line.entity';

@Entity()
export class StopLineMapping {
  @PrimaryKey({ type: 'uuid' })
  id = uuidv7();

  @ManyToOne({ primary: false, entity: () => Line })
  line: Line;

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
