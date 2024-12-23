import { assert, assertEquals } from "@std/assert";
import { err, isErr, isOk, ok } from "./result.ts";

Deno.test("ok should create an Ok Result", () => {
  const result = ok("test");

  assertEquals(result, { tag: "ok", value: "test" });
});

Deno.test("err should create an Err Result", () => {
  const result = err("test");

  assertEquals(result, { tag: "err", value: "test" });
});

Deno.test("isOk should return true for an Ok Result", () => {
  const result = ok("test");

  assert(isOk(result));
});

Deno.test("isOk should return false for an Err Result", () => {
  const result = err("test");

  assert(!isOk(result));
});

Deno.test("isErr should return true for an Err Result", () => {
  const result = err("test");

  assert(isErr(result));
});

Deno.test("isErr should return false for an Ok Result", () => {
  const result = ok("test");

  assert(!isErr(result));
});
