import { assertEquals, assertThrows } from "@std/assert";
import { none, some } from "./option.ts";
import { expect } from "./outcome.ts";
import { err, ok } from "./result.ts";

Deno.test("expect should return from an Ok Result", () => {
  const result = ok("test");

  assertEquals(expect(result, "message"), "test");
});

Deno.test("expect should return from a Some Option", () => {
  const result = some("test");

  assertEquals(expect(result, "message"), "test");
});

Deno.test("expect should throw an error for an Err Result", () => {
  const result = err("test");

  assertThrows(() => expect(result, "message"));
});

Deno.test("expect should throw an error for a None Option", () => {
  const result = none();

  assertThrows(() => expect(result, "message"));
});
