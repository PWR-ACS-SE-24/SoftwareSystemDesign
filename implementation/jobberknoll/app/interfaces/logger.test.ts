import { TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { newCtx } from "~/mod.ts";
import type { Ctx } from "~/shared/mod.ts";
import type { Logger } from "./logger.ts";

class SampleInfra {
  public constructor(logger: Logger) {
    this.instrumentedMethod = logger.instrument(this, this.instrumentedHandler);
    this.propagatedMethod = logger.propagate(this, this.propagatedHandler);
  }

  public readonly instrumentedMethod: (ctx: Ctx, arg1: string, arg2: number) => Promise<string>;
  private instrumentedHandler(arg1: string, arg2: number): Promise<string> {
    return Promise.resolve(`${arg1} ${arg2}`);
  }

  public readonly propagatedMethod: (ctx: Ctx, arg1: string, arg2: number) => Promise<string>;
  private propagatedHandler(ctx: Ctx, arg1: string, arg2: number): Promise<string> {
    return Promise.resolve(`${ctx.requestId} ${arg1} ${arg2}`);
  }
}

Deno.test("instrument should correctly wrap a handler function with logging", async () => {
  const logger = new TestLogger();
  const infra = new SampleInfra(logger);
  const ctx = newCtx();

  const result = await infra.instrumentedMethod(ctx, "hello", 42);

  assertEquals(result, "hello 42");
  assert(logger.matches("SampleInfra#instrumentedHandler - start", { args: ["hello", 42] }, ctx.requestId));
  assert(logger.matches("SampleInfra#instrumentedHandler - end", { res: "hello 42" }, ctx.requestId));
});

Deno.test("propagate should correctly wrap a handler function with logging", async () => {
  const logger = new TestLogger();
  const infra = new SampleInfra(logger);
  const ctx = newCtx();

  const result = await infra.propagatedMethod(ctx, "hello", 42);

  assertEquals(result, `${ctx.requestId} hello 42`);
  assert(logger.matches("SampleInfra#propagatedHandler - start", { args: ["hello", 42] }, ctx.requestId));
  assert(logger.matches("SampleInfra#propagatedHandler - end", { res: `${ctx.requestId} hello 42` }, ctx.requestId));
});
