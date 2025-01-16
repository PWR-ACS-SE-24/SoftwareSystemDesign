import { Accident } from '@app/accident/database/accident.entity';
import { Line } from '@app/line/database/line.entity';
import { Vehicle } from '@app/vehicle/database/vehicle.entity';
import { Check, Collection, Entity, Filter, Index, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

export const ROUTE_TRIGGER_NAME = 'check_start_time_not_in_past_route';

const CHECK_EXPRESSION = `
CREATE OR REPLACE FUNCTION check_start_time_not_in_past_for_route()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.start_time < CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'The start_time field cannot be in the past: %', NEW.start_time;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER ${ROUTE_TRIGGER_NAME} BEFORE INSERT OR UPDATE ON route FOR EACH ROW
EXECUTE FUNCTION check_start_time_not_in_past_for_route()`;

@Entity()
@Index<Route>({ name: 'hacky_way_to_get_trigger_to_work', expression: CHECK_EXPRESSION })
@Filter({ name: 'active', cond: { isActive: true }, default: true })
@Check<Route>({ name: 'route_time_check', expression: (columns) => `${columns.startTime} < ${columns.endTime}` })
export class Route {
  @PrimaryKey({ type: 'uuid' })
  id = uuidv7(); // TODO: redo as a custom type

  @Property({ nullable: false, default: true })
  isActive: boolean = true;

  @Property({ nullable: false, type: 'timestamp' })
  startTime: Date;

  @Property({ nullable: false, type: 'timestamp' })
  endTime: Date;

  @ManyToOne({ nullable: false, entity: () => Line })
  line: Line;

  @ManyToOne({ nullable: false, entity: () => Vehicle })
  vehicle: Vehicle;

  @OneToMany({ nullable: false, entity: () => Accident, mappedBy: (Accident) => Accident.route })
  accidents = new Collection<Accident>(this);

  constructor(startTime: Date, endTime: Date, line: Line, vehicle: Vehicle) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.line = line;
    this.vehicle = vehicle;
  }
}
