import type { AccountBase } from "./account-base.ts";

export type Passenger = AccountBase & {
  tag: "passenger";
  phoneNumber?: string;
};
