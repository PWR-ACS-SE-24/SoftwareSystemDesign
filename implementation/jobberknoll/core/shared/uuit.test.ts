import { assert, assertEquals } from "@std/assert";
import { isNone, isSome } from "./option.ts";
import { uuid } from "./uuid.ts";

Deno.test("uuid should generate a string with correct length", () => {
  const id = uuid();

  assertEquals(id.length, 36);
});

Deno.test("uuid should accept its own output", () => {
  const id = uuid();

  const option = uuid(id);

  assert(isSome(option));
});

Deno.test("uuid should accept valid input", () => {
  const option = uuid("0193f590-e4c4-774d-9d92-8bac692af898");

  assert(isSome(option));
});

Deno.test("uuid should reject invalid input", () => {
  const option = uuid("invalid");

  assert(isNone(option));
});
