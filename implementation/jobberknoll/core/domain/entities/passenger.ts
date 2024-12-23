import type { AccountBase } from "./account-base.ts";

export type Passenger = AccountBase & {
  type: "passenger";
  phoneNumber?: string;
};
