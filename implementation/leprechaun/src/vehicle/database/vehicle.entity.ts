import { Entity, Filter, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

@Entity()
@Filter({ name: 'active', cond: { isActive: true }, default: true })
export class Vehicle {
  @PrimaryKey({ type: 'uuid' })
  id = uuidv7(); // TODO: redo as a custom type

  @Property({ length: 16, nullable: false })
  sideNumber: string;

  @Property({ nullable: false, default: true })
  isActive: boolean = true;

  constructor(sideNumber: string) {
    this.sideNumber = sideNumber;
  }
}
