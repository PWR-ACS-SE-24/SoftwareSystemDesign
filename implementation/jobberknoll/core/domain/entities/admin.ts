import type { AccountBase } from "./account-base.ts";

export type Admin = AccountBase & { tag: "admin" };
