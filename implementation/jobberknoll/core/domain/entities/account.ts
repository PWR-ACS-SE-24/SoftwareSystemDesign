import type { Admin } from "./admin.ts";
import type { Driver } from "./driver.ts";
import type { Inspector } from "./inspector.ts";
import type { Passenger } from "./passenger.ts";

export type Account = Passenger | Driver | Admin | Inspector;
