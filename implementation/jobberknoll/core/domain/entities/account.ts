import type { UUID } from "@jobberknoll/core/shared";

type AccountBase = {
  id: UUID;
  fullName: string;
  email: string;
  hashedPassword: string;
  lastModified: number;
};

export type Passenger = AccountBase & {
  type: "passenger";
  phoneNumber: string | null;
};

export type Driver = AccountBase & {
  type: "driver";
};

export type Admin = AccountBase & {
  type: "admin";
};

export type Inspector = AccountBase & {
  type: "inspector";
};

export type Account = Passenger | Driver | Admin | Inspector;
