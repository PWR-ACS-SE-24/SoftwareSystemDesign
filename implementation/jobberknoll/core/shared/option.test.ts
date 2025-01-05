import { assert, assertEquals } from "@std/assert";
import { isNone, isSome, none, some } from "./option.ts";

Deno.test("some should create a Some Option", () => {
  const result = some("test");

  assertEquals(result, { tag: "some", value: "test" });
});

Deno.test("none should create a None Option", () => {
  const result = none();

  assertEquals(result, { tag: "none" });
});

Deno.test("isSome should return true for Some Option", () => {
  const result = some("test");

  assert(isSome(result));
});

Deno.test("isSome should return false for None Option", () => {
  const result = none();

  assert(!isSome(result));
});

Deno.test("isNone should return true for None Option", () => {
  const result = none();

  assert(isNone(result));
});

Deno.test("isNone should return false for Some Option", () => {
  const result = some("test");

  assert(!isNone(result));
});
