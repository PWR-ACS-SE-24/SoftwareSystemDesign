import { v7 as generate, validate, version } from "uuid";
import { none, type Option, some } from "./option.ts";

const __brand: unique symbol = Symbol("UUID");
export type UUID = string & { readonly __brand: typeof __brand };

export function uuid(): UUID;
export function uuid(text: string): Option<UUID>;
export function uuid(text?: string): UUID | Option<UUID> {
  if (text === undefined) {
    return generate() as UUID;
  }

  if (validate(text) && version(text) === 7) {
    return some(text as UUID);
  }

  return none();
}
