import { Entity, Filter, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

@Entity()
@Filter({ name: 'active', cond: { isActive: true }, default: true })
export class Stop {
  @PrimaryKey()
  id = uuidv7(); // TODO: redo as a custom type

  @Property({ length: 255, nullable: false })
  name: string;

  @Property({ type: 'float8', nullable: false })
  latitude: number;

  @Property({ type: 'float8', nullable: false })
  longitude: number;

  @Property({ nullable: false, default: true })
  isActive: boolean = true;
}
