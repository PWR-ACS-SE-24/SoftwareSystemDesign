import { NIL, v7 as generate, validate, version } from "uuid";
import { none, type Option, some } from "./option.ts";

const __brand: unique symbol = Symbol("UUID");
export type UUID = string & { readonly __brand: typeof __brand };

export const NIL_UUID = NIL as UUID; // SAFETY: NIL is a valid UUID

export function uuid(): UUID;
export function uuid(text: string): Option<UUID>;
export function uuid(text?: string): UUID | Option<UUID> {
  if (text === undefined) {
    return generate() as UUID; // SAFETY: generate always returns a valid UUID
  }

  if (text === NIL) {
    return some(NIL_UUID);
  }

  if (validate(text) && version(text) === 7) {
    return some(text as UUID); // SAFETY: validate ensures that the UUID is valid
  }

  return none();
}
