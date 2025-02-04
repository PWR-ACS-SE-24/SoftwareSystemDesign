import { Route } from '@app/route/database/route.entity';
import { Check, Collection, Entity, Filter, Index, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';
import { StopLineMapping } from './stop-line-mapping.entity';

@Entity()
@Filter({ name: 'active', cond: { isActive: true }, default: true })
@Check<Line>({ name: 'line_name_check', expression: (columns) => `${columns.name} <> ''` })
@Index<Line>({ name: 'line_name_index', properties: ['name'], type: 'fulltext' })
export class Line {
  @PrimaryKey({ type: 'uuid' })
  id = uuidv7(); // TODO: redo as a custom type

  @Property({ length: 4, nullable: false })
  name: string;

  @Property({ nullable: false, default: true })
  isActive: boolean = true;

  @OneToMany({
    entity: () => StopLineMapping,
    mappedBy: (StopLineMapping) => StopLineMapping.line,
    orderBy: { order: 'ASC' },
  })
  mappings = new Collection<StopLineMapping>(this);

  @OneToMany({
    entity: () => Route,
    mappedBy: (Route) => Route.line,
  })
  routes = new Collection<Route>(this);

  constructor(name: string) {
    this.name = name;
  }
}
