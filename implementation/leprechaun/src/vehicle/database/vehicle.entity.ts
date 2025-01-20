import { Route } from '@app/route/database/route.entity';
import { Check, Collection, Entity, Filter, Index, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

@Entity()
@Check<Vehicle>({ name: 'vehicle_name_check', expression: (columns) => `${columns.sideNumber} <> ''` })
@Index<Vehicle>({ name: 'vehicle_side_number_index', properties: ['sideNumber'], type: 'fulltext' })
@Filter({ name: 'active', cond: { isActive: true }, default: true })
export class Vehicle {
  @PrimaryKey({ type: 'uuid' })
  id = uuidv7(); // TODO: redo as a custom type

  @Property({ length: 16, nullable: false, unique: true })
  sideNumber: string;

  @Property({ nullable: false, default: true })
  isActive: boolean = true;

  @OneToMany({
    entity: () => Route,
    mappedBy: (Route) => Route.vehicle,
  })
  routes = new Collection<Route>(this);

  constructor(sideNumber: string) {
    this.sideNumber = sideNumber;
  }
}
