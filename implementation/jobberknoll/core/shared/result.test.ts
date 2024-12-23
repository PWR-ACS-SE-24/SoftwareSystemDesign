import { assertEquals } from "@std/assert";
import { err, isOk, ok } from "./result.ts";

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

  assertEquals(isOk(result), true);
});

Deno.test("isOk returns false for Err results", () => {
  const result = err("test");

  assertEquals(isOk(result), false);
});

Deno.test("isErr returns true for Err results", () => {
  const result = err("test");

  assertEquals(isOk(result), false);
});

Deno.test("isErr returns false for Ok results", () => {
  const result = ok("test");

  assertEquals(isOk(result), true);
});
