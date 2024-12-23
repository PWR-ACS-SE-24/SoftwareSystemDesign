import { assert, assertEquals } from "@std/assert";
import { err, isErr, isOk, ok } from "./result.ts";

Deno.test("ok creates an Ok result", () => {
  const result = ok("test");

  assertEquals(result, { tag: "ok", value: "test" });
});

Deno.test("err creates an Err result", () => {
  const result = err("test");

  assertEquals(result, { tag: "err", value: "test" });
});

Deno.test("isOk returns true for Ok results", () => {
  const result = ok("test");

  assert(isOk(result));
});

Deno.test("isOk returns false for Err results", () => {
  const result = err("test");

  assert(!isOk(result));
});

Deno.test("isErr returns true for Err results", () => {
  const result = err("test");

  assert(isErr(result));
});

Deno.test("isErr returns false for Ok results", () => {
  const result = ok("test");

  assert(!isErr(result));
});
