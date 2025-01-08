import { assert, assertNotEquals } from "@std/assert";
import { isSome, uuid } from "../../core/shared/mod.ts";
import { newCtx } from "./ctx.ts";

Deno.test("newCtx should return a context with a valid UUID", () => {
  const ctx = newCtx();

  assert(isSome(uuid(ctx.requestId)));
});

Deno.test("newCtx should produce different UUIDs on different calls", () => {
  const ctx1 = newCtx();
  const ctx2 = newCtx();

  assertNotEquals(ctx1.requestId, ctx2.requestId);
});
