import { Route } from '@app/route/database/route.entity';
import { Check, Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

export const ACCIDENT_TRIGGER_NAME = 'check_time_not_in_future_accident';

// Some hacky way to add a trigger to the table
const CHECK_EXPRESSION = `
CREATE OR REPLACE FUNCTION check_time_not_in_future_for_accident()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.time > statement_timestamp() THEN
        RAISE EXCEPTION 'The time field cannot be in the future: NEW: % > CURRENT: %', NEW.time, statement_timestamp();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER ${ACCIDENT_TRIGGER_NAME} BEFORE INSERT OR UPDATE ON accident FOR EACH ROW
EXECUTE FUNCTION check_time_not_in_future_for_accident()`;

@Entity()
@Check<Accident>({ name: 'accident_description_check', expression: (columns) => `${columns.description} <> ''` })
@Index({ name: 'hacky_way_to_get_trigger_to_work', expression: CHECK_EXPRESSION })
export class Accident {
  @PrimaryKey({ type: 'uuid' })
  id = uuidv7();

  // Time will not be auto-generated as CURRENT_TIMESTAMP, because frontend will provide the
  // time when driver or validator clicks "add accident button".
  @Property({ nullable: false })
  time: Date;

  @Property({ nullable: false, default: false })
  resolved: boolean = false;

  @Property({ nullable: false, length: 255 })
  description: string;

  @ManyToOne({ nullable: false, entity: () => Route })
  route: Route;

  constructor(time: Date, description: string, route: Route, resolved: boolean = false) {
    this.time = time;
    this.description = description;
    this.route = route;
    this.resolved = resolved;
  }
}
