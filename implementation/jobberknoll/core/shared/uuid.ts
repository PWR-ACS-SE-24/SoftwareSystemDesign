import { generate, validate } from "@std/uuid/unstable-v7";
import { none, type Option, some } from "./option.ts";

const __brand: unique symbol = Symbol("UUID");
export type UUID = string & { readonly __brand: typeof __brand };

export function uuid(): UUID;
export function uuid(text: string): Option<UUID>;
export function uuid(text?: string): UUID | Option<UUID> {
  if (text === undefined) {
    return generate() as UUID;
  }

  if (validate(text)) {
    return some(text as UUID);
  }

  return none();
}
