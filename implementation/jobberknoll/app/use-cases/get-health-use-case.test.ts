import { isOk } from "@jobberknoll/core/shared";
import { TestLogger } from "@jobberknoll/infra";
import { assert } from "@std/assert/assert";
import { assertEquals } from "@std/assert/equals";
import { newCtx } from "~/mod.ts";
import { GetHealthUseCase } from "./get-health-use-case.ts";

Deno.test("GetHealthUseCase should return the health status", async () => {
  const logger = new TestLogger();
  const getHealth = new GetHealthUseCase(logger);

  const result = await getHealth.invoke(newCtx(), null);

  assert(isOk(result));
  assertEquals(result.value, { status: "UP" });
});
